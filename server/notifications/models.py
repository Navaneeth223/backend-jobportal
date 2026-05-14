import uuid
from django.db import models
from users.models import User


class Notification(models.Model):

    TYPE_CHOICES = [
        ('application', 'Application'),
        ('interview',   'Interview'),
        ('message',     'Message'),
        ('job',         'Job'),
    ]

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type       = models.CharField(max_length=50, choices=TYPE_CHOICES)
    text       = models.TextField()
    action_url = models.URLField(blank=True)
    read       = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} — {self.user.email}"

    class Meta:
        ordering = ['-created_at']