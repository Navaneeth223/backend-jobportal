import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Conversation, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data       = json.loads(text_data)
        message    = data.get('message', '')
        sender_id  = data.get('sender_id')

        if not message or not sender_id:
            return

        # Save message to database
        saved = await self.save_message(
            conversation_id=self.conversation_id,
            sender_id=sender_id,
            text=message
        )

        # Broadcast to everyone in the room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':            'chat_message',
                'message':         message,
                'sender_id':       str(sender_id),
                'message_id':      str(saved.id),
                'created_at':      str(saved.created_at),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message':    event['message'],
            'sender_id':  event['sender_id'],
            'message_id': event['message_id'],
            'created_at': event['created_at'],
        }))

    @database_sync_to_async
    def save_message(self, conversation_id, sender_id, text):
        conversation = Conversation.objects.get(id=conversation_id)
        sender       = User.objects.get(id=sender_id)
        message      = Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text
        )
        # Update last message on conversation
        conversation.last_message    = text
        conversation.last_message_at = message.created_at
        conversation.save()
        return message