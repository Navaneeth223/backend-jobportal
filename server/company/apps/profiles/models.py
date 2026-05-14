import uuid
from django.db import models
from users.models import User


class Company(models.Model):

    SIZE_CHOICES = [
        ('1-10',    '1-10'),
        ('11-50',   '11-50'),
        ('51-200',  '51-200'),
        ('201-500', '201-500'),
        ('500+',    '500+'),
    ]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company')
    name        = models.CharField(max_length=255)
    category    = models.CharField(max_length=255, blank=True)
    logo_url    = models.URLField(blank=True)
    location    = models.CharField(max_length=255, blank=True)
    address     = models.TextField(blank=True)
    phone       = models.CharField(max_length=20, blank=True)
    email       = models.EmailField(blank=True)
    website     = models.URLField(blank=True)
    employees   = models.CharField(max_length=50, choices=SIZE_CHOICES, blank=True)
    about       = models.TextField(blank=True)
    vision      = models.TextField(blank=True)
    mission     = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'company_profiles'


class CompanyReview(models.Model):

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company      = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='reviews')
    candidate_id = models.UUIDField()
    rating       = models.PositiveSmallIntegerField()
    title        = models.CharField(max_length=255)
    body         = models.TextField()
    pros         = models.TextField(blank=True)
    cons         = models.TextField(blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} — {self.company.name}"

    class Meta:
        app_label = 'company_profiles'