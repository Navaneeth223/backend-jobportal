import uuid
from django.db import models
from company.apps.profiles.models import Company


class JobCategory(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=100, unique=True)
    slug       = models.SlugField(unique=True)
    icon       = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'company_jobs'
        verbose_name_plural = 'Job Categories'

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

    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company             = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title               = models.CharField(max_length=255, db_index=True)
    category_name       = models.CharField(max_length=255, blank=True)
    category            = models.ForeignKey(JobCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name='jobs')
    job_type            = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES)
    work_mode           = models.CharField(max_length=50, choices=WORK_MODE_CHOICES)
    location            = models.CharField(max_length=255, blank=True)
    salary_min          = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max          = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description         = models.TextField()
    benefits            = models.TextField(blank=True)
    skills_legacy       = models.JSONField(default=list, blank=True)
    experience_required = models.IntegerField(default=0)
    vacancies           = models.IntegerField(default=1)
    deadline            = models.DateField(null=True, blank=True)
    contact_email       = models.EmailField(blank=True)
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    posted_at           = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} — {self.company.name}"

    class Meta:
        app_label = 'company_jobs'
        ordering = ['-posted_at']


class JobSkill(models.Model):
    id         = models.AutoField(primary_key=True)
    job        = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='job_skills')
    skill_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.skill_name} for {self.job.title}"

    class Meta:
        app_label = 'company_jobs'