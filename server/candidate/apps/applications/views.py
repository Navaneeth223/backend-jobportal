from rest_framework import generics, permissions, serializers
from .models import Application
from .serializers import ApplicationSerializer
from candidate.apps.profiles.models import CandidateProfile

class ApplicationListView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            candidate__user=self.request.user
        ).exclude(candidate_status='withdrawn').select_related('job', 'company')

    def perform_create(self, serializer):
        try:
            candidate = CandidateProfile.objects.get(user=self.request.user)
        except CandidateProfile.DoesNotExist:
            raise serializers.ValidationError({"detail": "Candidate profile not found."})

        job = serializer.validated_data['job']
        
        if Application.objects.filter(candidate=candidate, job=job).exists():
            raise serializers.ValidationError({"detail": "You have already applied for this job."})

        serializer.save(candidate=candidate, company=job.company)


class ApplicationDetailView(generics.DestroyAPIView):
    """
    DELETE /api/candidates/applications/<uuid:application_id>/
    Soft deletes an application by setting candidate_status = 'withdrawn'
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(candidate__user=self.request.user)

    def perform_destroy(self, instance):
        instance.candidate_status = 'withdrawn'
        instance.save()
