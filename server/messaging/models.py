import uuid
from django.db import models
from candidate.apps.profiles.models import CandidateProfile
from company.apps.profiles.models import Company
from company.apps.jobs.models import Job


class Conversation(models.Model):

    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company           = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='conversations')
    candidate         = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='conversations')
    job               = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='conversations', null=True, blank=True)
    messages_legacy   = models.JSONField(default=list)
    last_message      = models.CharField(max_length=500, blank=True)
    last_message_at   = models.DateTimeField(null=True, blank=True)
    unread_company    = models.IntegerField(default=0)
    unread_candidate  = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.company} ↔ {self.candidate}"

    class Meta:
        ordering = ['-last_message_at']

class Message(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation   = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='message_set')
    sender         = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sent_messages')
    text           = models.TextField()
    attachment_url = models.URLField(blank=True)
    is_read        = models.BooleanField(default=False)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.sender.email} in {self.conversation}"

    class Meta:
        db_table = 'messages'
        ordering = ['created_at']