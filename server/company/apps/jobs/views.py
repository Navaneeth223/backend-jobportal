from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Job, JobSkill
from .serializers import JobSerializer, JobSkillSerializer

class JobListView(generics.ListAPIView):
    """
    GET /api/jobs/
    Returns a list of all open jobs. Supports filtering via query params.
    """
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # By default, candidates should only see 'open' jobs
        queryset = Job.objects.filter(status='open').select_related('company')

        # Filtering
        keyword = self.request.query_params.get('keyword', None)
        location = self.request.query_params.get('location', None)
        job_type = self.request.query_params.get('job_type', None)
        work_mode = self.request.query_params.get('work_mode', None)
        category = self.request.query_params.get('category', None)
        experience = self.request.query_params.get('experience_required') or self.request.query_params.get('experience')

        if keyword:
            queryset = queryset.filter(
                Q(title__icontains=keyword) | 
                Q(description__icontains=keyword) | 
                Q(company__name__icontains=keyword)
            )
        if location:
            queryset = queryset.filter(
                Q(location__icontains=location) | 
                Q(company__location__icontains=location)
            )
        if job_type:
            # Assuming multiple job types can be passed comma-separated, or single
            job_types = job_type.split(',')
            queryset = queryset.filter(job_type__in=job_types)
        if work_mode:
            work_modes = work_mode.split(',')
            queryset = queryset.filter(work_mode__in=work_modes)
        if category:
            categories = category.split(',')
            queryset = queryset.filter(category__in=categories)
        if experience:
            try:
                queryset = queryset.filter(experience_required__lte=int(experience))
            except ValueError:
                pass

        return queryset


class JobDetailView(generics.RetrieveAPIView):
    """
    GET /api/jobs/<uuid:pk>/
    Returns details of a specific job.
    """
    queryset = Job.objects.filter(status='open').select_related('company')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]


class JobSkillAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(pk=job_id)
            skill_name = request.data.get('skill_name')
            if not skill_name:
                return Response({'error': 'skill_name is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            job_skill = JobSkill.objects.create(job=job, skill_name=skill_name)
            serializer = JobSkillSerializer(job_skill)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)


class JobSkillDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, job_id, pk):
        try:
            job_skill = JobSkill.objects.get(pk=pk, job_id=job_id)
            job_skill.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except JobSkill.DoesNotExist:
            return Response({'error': 'JobSkill not found'}, status=status.HTTP_404_NOT_FOUND)
