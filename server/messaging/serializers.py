from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_email', 'sender_role', 'text', 'attachment_url', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'conversation', 'is_read', 'created_at']

class ConversationSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.URLField(source='company.logo_url', read_only=True)
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'company', 'company_name', 'company_logo', 
            'candidate', 'candidate_name', 'job', 'job_title', 
            'last_message', 'last_message_at', 
            'unread_company', 'unread_candidate'
        ]
