from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'text', 'action_url', 'read', 'created_at']
        read_only_fields = ['id', 'type', 'text', 'action_url', 'created_at']
