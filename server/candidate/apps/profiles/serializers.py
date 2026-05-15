from rest_framework import serializers
from .models import CandidateProfile, CandidateEducation, CandidateExperience


class CandidateEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CandidateEducation
        fields = ['id', 'degree', 'institution', 'start_date', 'end_date', 'cgpa']


class CandidateExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CandidateExperience
        fields = ['id', 'title', 'company', 'start_date', 'end_date', 'description', 'years']


class CandidateProfileSerializer(serializers.ModelSerializer):
    education  = CandidateEducationSerializer(many=True, read_only=True)
    experience = CandidateExperienceSerializer(many=True, read_only=True)

    class Meta:
        model  = CandidateProfile
        fields = [
            'id', 'name', 'email', 'phone', 'avatar_url',
            'title', 'location', 'bio', 'dob', 'gender',
            'experience_years', 'linkedin', 'github', 'portfolio',
            'resume_url', 'skills', 'education', 'experience',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']