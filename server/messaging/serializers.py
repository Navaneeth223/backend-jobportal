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

    company_initials = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    application_stage = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'company', 'company_name', 'company_logo', 
            'candidate', 'candidate_name', 'job', 'job_title', 
            'last_message', 'last_message_at', 
            'unread_company', 'unread_candidate',
            'company_initials', 'location', 'experience', 'application_stage'
        ]

    def get_company_initials(self, obj):
        name = obj.company.name if obj.company else ''
        if not name:
            return 'CO'
        parts = name.split()
        if len(parts) >= 2:
            return (parts[0][0] + parts[1][0]).upper()
        return name[:2].upper()

    def get_location(self, obj):
        if obj.job and obj.job.location:
            return obj.job.location
        if obj.company and obj.company.location:
            return obj.company.location
        return 'Location not specified'

    def get_experience(self, obj):
        # Return fallback value since experience fields are not directly on company models
        return 'Not specified'

    def get_application_stage(self, obj):
        if obj.job and obj.candidate:
            from candidate.apps.applications.models import Application
            try:
                app = Application.objects.get(job=obj.job, candidate=obj.candidate)
                stage = app.recruiter_status if app.candidate_status != 'withdrawn' else 'withdrawn'
                return stage.replace('_', ' ').capitalize()
            except Application.DoesNotExist:
                return None
        return None

