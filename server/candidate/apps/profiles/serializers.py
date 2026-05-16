from rest_framework import serializers
from .models import CandidateProfile, CandidateEducation, CandidateExperience, CandidateSkill

class CandidateSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateSkill
        fields = ['id', 'name', 'level']


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
        fields = ['id', 'title', 'company', 'start_date', 'end_date', 'description', 'years']


class CandidateProfileSerializer(serializers.ModelSerializer):
    education  = CandidateEducationSerializer(many=True, read_only=True)
    experience = CandidateExperienceSerializer(many=True, read_only=True)
    skill_set  = CandidateSkillSerializer(many=True, read_only=True)

    class Meta:
        model  = CandidateProfile
        fields = [
            'id', 'name', 'email', 'phone', 'avatar_url',
            'title', 'location', 'bio', 'dob', 'gender',
            'experience_years', 'linkedin', 'github', 'portfolio',
            'resume_url', 'skills_legacy', 'skill_set', 'education', 'experience',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'email':       {'required': False, 'allow_blank': True},
            'phone':       {'required': False, 'allow_blank': True},
            'name':        {'required': False, 'allow_blank': True},
            'location':    {'required': False, 'allow_blank': True},
            'dob':         {'required': False, 'allow_null': True},
            'gender':      {'required': False, 'allow_blank': True},
            'title':       {'required': False, 'allow_blank': True},
            'bio':         {'required': False, 'allow_blank': True},
            'linkedin':    {'required': False, 'allow_blank': True},
            'github':      {'required': False, 'allow_blank': True},
            'portfolio':   {'required': False, 'allow_blank': True},
            'resume_url':  {'required': False, 'allow_blank': True},
            'avatar_url':  {'required': False, 'allow_blank': True},
            'experience_years': {'required': False, 'allow_blank': True},
        }