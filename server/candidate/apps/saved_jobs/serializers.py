from rest_framework import serializers
from .models import SavedJob


class SavedJobSerializer(serializers.ModelSerializer):
    job_title    = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)
    location     = serializers.CharField(source='job.location', read_only=True)
    job_type     = serializers.CharField(source='job.job_type', read_only=True)
    work_mode    = serializers.CharField(source='job.work_mode', read_only=True)
    salary_min   = serializers.DecimalField(source='job.salary_min', max_digits=10, decimal_places=2, read_only=True)
    salary_max   = serializers.DecimalField(source='job.salary_max', max_digits=10, decimal_places=2, read_only=True)
    status       = serializers.CharField(source='job.status', read_only=True)

    class Meta:
        model  = SavedJob
        fields = [
            'id', 'job', 'job_title', 'company_name',
            'location', 'job_type', 'work_mode',
            'salary_min', 'salary_max', 'status', 'saved_at',
        ]
        read_only_fields = ['id', 'saved_at']