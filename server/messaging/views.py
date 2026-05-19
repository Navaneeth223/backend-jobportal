from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListView(generics.ListAPIView):
    """
    GET /api/conversations/
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'company':
            return Conversation.objects.filter(company__user=user)
        elif user.role == 'candidate':
            return Conversation.objects.filter(candidate__user=user)
        return Conversation.objects.none()

class MessageListView(generics.ListCreateAPIView):
    """
    GET /api/conversations/<uuid:conversation_id>/messages/
    POST /api/conversations/<uuid:conversation_id>/messages/
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs.get('conversation_id')
        return Message.objects.filter(conversation_id=conv_id)

    def perform_create(self, serializer):
        conv_id = self.kwargs.get('conversation_id')
        conversation = Conversation.objects.get(id=conv_id)
        
        # Save the message
        serializer.save(sender=self.request.user, conversation=conversation)
        
        # Update conversation last_message logic
        conversation.last_message = serializer.validated_data.get('text', '')[:500]
        conversation.last_message_at = serializer.instance.created_at
        
        if self.request.user.role == 'candidate':
            conversation.unread_company += 1
        elif self.request.user.role == 'company':
            conversation.unread_candidate += 1
            
        conversation.save(update_fields=['last_message', 'last_message_at', 'unread_company', 'unread_candidate'])


class ConversationReadView(APIView):
    """
    PUT /api/conversations/<uuid:conversation_id>/read/
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        
        # Mark all messages in this conversation not sent by current user as read
        Message.objects.filter(conversation=conversation).exclude(sender=user).update(is_read=True)

        # Reset unread counts depending on role
        if user.role == 'candidate':
            conversation.unread_candidate = 0
        elif user.role == 'company':
            conversation.unread_company = 0
        
        conversation.save(update_fields=['unread_candidate', 'unread_company'])
        return Response({'message': 'Conversation marked as read'}, status=status.HTTP_200_OK)


