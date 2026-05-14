import uuid
from django.db import models
from company.apps.profiles.models import Company


class Job(models.Model):

    STATUS_CHOICES = [
        ('open',   'Open'),
        ('closed', 'Closed'),
        ('draft',  'Draft'),
    ]

    JOB_TYPE_CHOICES = [
        ('full_time',  'Full-time'),
        ('part_time',  'Part-time'),
        ('contract',   'Contract'),
        ('internship', 'Internship'),
    ]

    WORK_MODE_CHOICES = [
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
        ('onsite', 'Onsite'),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company       = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title         = models.CharField(max_length=255, db_index=True)
    category      = models.CharField(max_length=255, blank=True)
    job_type      = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES)
    work_mode     = models.CharField(max_length=50, choices=WORK_MODE_CHOICES)
    location      = models.CharField(max_length=255, blank=True)
    salary_min    = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max    = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description   = models.TextField()
    benefits      = models.TextField(blank=True)
    skills        = models.JSONField(default=list, blank=True)
    deadline      = models.DateField(null=True, blank=True)
    contact_email = models.EmailField(blank=True)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    posted_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} — {self.company.name}"

    class Meta:
        app_label = 'company_jobs'
        ordering = ['-posted_at']