from rest_framework import generics, permissions
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer

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

        return queryset


class JobDetailView(generics.RetrieveAPIView):
    """
    GET /api/jobs/<uuid:pk>/
    Returns details of a specific job.
    """
    queryset = Job.objects.filter(status='open').select_related('company')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
