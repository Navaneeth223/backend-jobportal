from rest_framework import serializers
from .models import CandidateProfile, CandidateEducation, CandidateExperience, CandidateSkill

class CandidateSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateSkill
        fields = ['id', 'skill_name', 'experience_level']


class CandidateEducationSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)
    
    class Meta:
        model  = CandidateEducation
        fields = ['id', 'degree', 'institution', 'start_date', 'end_date', 'cgpa']


class CandidateExperienceSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(required=False, allow_null=True)
    end_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model  = CandidateExperience
        fields = ['id', 'job_title', 'company_name', 'start_date', 'end_date', 'description', 'present']


class CandidateProfileSerializer(serializers.ModelSerializer):
    education  = CandidateEducationSerializer(many=True, read_only=True)
    experience = CandidateExperienceSerializer(many=True, read_only=True)
    skill_set  = CandidateSkillSerializer(many=True, read_only=True)

    class Meta:
        model  = CandidateProfile
        fields = [
            'id', 'full_name', 'email', 'phone', 'profile_image',
            'current_role', 'location', 'professional_summary', 'dob', 'gender',
            'experience_years', 'expected_salary', 'linkedin', 'github', 'portfolio',
            'resume', 'skills_legacy', 'skill_set', 'education', 'experience',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'email':       {'required': False, 'allow_blank': True},
            'phone':       {'required': False, 'allow_blank': True},
            'full_name':   {'required': False, 'allow_blank': True},
            'location':    {'required': False, 'allow_blank': True},
            'dob':         {'required': False, 'allow_null': True},
            'gender':      {'required': False, 'allow_blank': True},
            'current_role': {'required': False, 'allow_blank': True},
            'professional_summary': {'required': False, 'allow_blank': True},
            'linkedin':    {'required': False, 'allow_blank': True},
            'github':      {'required': False, 'allow_blank': True},
            'portfolio':   {'required': False, 'allow_blank': True},
            'resume':      {'required': False, 'allow_blank': True},
            'profile_image': {'required': False, 'allow_blank': True},
            'experience_years': {'required': False, 'allow_blank': True},
        }