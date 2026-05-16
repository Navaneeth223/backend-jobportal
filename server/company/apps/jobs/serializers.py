from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.URLField(source='company.logo_url', read_only=True)
    company_location = serializers.CharField(source='company.location', read_only=True)

    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'category_name', 'category', 'job_type', 'work_mode', 'location',
            'salary_min', 'salary_max', 'description', 'benefits', 'skills',
            'deadline', 'contact_email', 'status', 'posted_at',
            'company_name', 'company_logo', 'company_location'
        ]

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name
        return obj.category_name
