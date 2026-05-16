import uuid
from django.db import models
from users.models import User


class CandidateProfile(models.Model):

    GENDER_CHOICES = [
        ('male',             'Male'),
        ('female',           'Female'),
        ('other',            'Other'),
        ('prefer_not_to_say','Prefer not to say'),
    ]

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user             = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate')
    name             = models.CharField(max_length=255, blank=True)
    email            = models.EmailField(blank=True)
    phone            = models.CharField(max_length=20, blank=True)
    avatar_url       = models.URLField(blank=True)
    title            = models.CharField(max_length=255, blank=True)
    location         = models.CharField(max_length=255, blank=True)
    bio              = models.TextField(blank=True)
    dob              = models.DateField(null=True, blank=True)
    gender           = models.CharField(max_length=50, choices=GENDER_CHOICES, blank=True)
    experience_years = models.CharField(max_length=50, blank=True)
    linkedin         = models.URLField(blank=True)
    github           = models.URLField(blank=True)
    portfolio        = models.URLField(blank=True)
    resume_url       = models.URLField(blank=True)
    skills_legacy    = models.JSONField(default=list, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or self.user.email

    class Meta:
        app_label = 'candidate_profiles'


class CandidateEducation(models.Model):

    id          = models.AutoField(primary_key=True)
    candidate   = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='education')
    degree      = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    start_date  = models.DateField()
    end_date    = models.DateField(null=True, blank=True)
    cgpa        = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.degree} — {self.institution}"

    class Meta:
        app_label = 'candidate_profiles'


class CandidateExperience(models.Model):

    id          = models.AutoField(primary_key=True)
    candidate   = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='experience')
    title       = models.CharField(max_length=255)
    company     = models.CharField(max_length=255)
    start_date  = models.DateField()
    end_date    = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    years       = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

    class Meta:
        app_label = 'candidate_profiles'

class CandidateSkill(models.Model):

    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('expert', 'Expert'),
    ]

    id        = models.AutoField(primary_key=True)
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='skill_set')
    name      = models.CharField(max_length=100)
    level     = models.CharField(max_length=20, choices=LEVEL_CHOICES, blank=True)

    def __str__(self):
        return f"{self.name} ({self.level})"

    class Meta:
        app_label = 'candidate_profiles'
        db_table = 'candidate_skills'