import json
import uuid
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Conversation, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Parse query params for JWT token
        query_string = self.scope.get('query_string', b'').decode('utf-8')
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            await self.close()
            return

        # Validate token and fetch user
        user = await self.get_user_from_token(token)
        if not user:
            await self.close()
            return

        # Keep user in scope for secure message operations
        self.scope['user'] = user

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data       = json.loads(text_data)
        message    = data.get('message', '')

        if not message:
            return

        # Use authentic user from scope as sender
        sender = self.scope['user']

        # Save message to database
        saved = await self.save_message(
            conversation_id=self.conversation_id,
            sender=sender,
            text=message
        )

        if not saved:
            return

        # Broadcast to everyone in the room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':            'chat_message',
                'message':         message,
                'sender_id':       str(sender.id),
                'sender_role':     str(sender.role),
                'message_id':      str(saved.id),
                'created_at':      str(saved.created_at),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message':    event['message'],
            'sender_id':  event['sender_id'],
            'sender_role': event['sender_role'],
            'message_id': event['message_id'],
            'created_at': event['created_at'],
        }))

    @database_sync_to_async
    def get_user_from_token(self, token_string):
        try:
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token_string)
            user = jwt_auth.get_user(validated_token)
            return user
        except (InvalidToken, TokenError, Exception):
            return None

    @database_sync_to_async
    def save_message(self, conversation_id, sender, text):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return None
        
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text
        )
        # Update last message on conversation
        conversation.last_message    = text
        conversation.last_message_at = message.created_at
        
        # Increment unread count for other side
        if sender.role == 'company':
            conversation.unread_candidate += 1
        elif sender.role == 'candidate':
            conversation.unread_company += 1

        conversation.save()
        return message