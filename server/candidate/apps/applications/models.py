import uuid
from django.db import models
from candidate.apps.profiles.models import CandidateProfile
from company.apps.profiles.models import Company
from company.apps.jobs.models import Job


class Application(models.Model):

    CANDIDATE_STATUS_CHOICES = [
        ('applied',    'Applied'),
        ('withdrawn',  'Withdrawn'),
    ]

    RECRUITER_STATUS_CHOICES = [
        ('reviewing',  'Reviewing'),
        ('interview',  'Interview'),
        ('selected',   'Selected'),
        ('rejected',   'Rejected'),
    ]

    INTERVIEW_TYPE_CHOICES = [
        ('zoom',         'Zoom'),
        ('google_meet',  'Google Meet'),
        ('offline',      'Offline'),
    ]

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job              = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate        = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='applications')
    company          = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='applications')
    cover_letter     = models.TextField(blank=True)
    message          = models.TextField(blank=True)
    resume           = models.URLField(blank=True)
    candidate_status = models.CharField(max_length=20, choices=CANDIDATE_STATUS_CHOICES, default='applied')
    recruiter_status = models.CharField(max_length=20, choices=RECRUITER_STATUS_CHOICES, default='reviewing')
    interview_date   = models.DateTimeField(null=True, blank=True)
    interview_type   = models.CharField(max_length=20, choices=INTERVIEW_TYPE_CHOICES, blank=True)
    applied_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.candidate} → {self.job.title}"

    class Meta:
        app_label = 'candidate_applications'
        unique_together = [('job', 'candidate')]
        ordering = ['-applied_at']