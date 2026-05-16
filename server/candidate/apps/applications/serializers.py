from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.URLField(source='company.logo_url', read_only=True)
    location = serializers.CharField(source='job.location', read_only=True)
    job_type = serializers.CharField(source='job.job_type', read_only=True)
    work_mode = serializers.CharField(source='job.work_mode', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'company_name', 'company_logo',
            'location', 'job_type', 'work_mode',
            'cover_letter', 'message', 'cv_url',
            'candidate_status', 'recruiter_status',
            'interview_date', 'interview_type',
            'applied_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'candidate_status', 'recruiter_status', 
            'interview_date', 'interview_type', 
            'applied_at', 'updated_at'
        ]
