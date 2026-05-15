from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from candidate.apps.profiles.models import CandidateProfile
from company.apps.jobs.models import Job
from .models import SavedJob
from .serializers import SavedJobSerializer


class SavedJobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile    = CandidateProfile.objects.get(user=request.user)
            saved_jobs = SavedJob.objects.filter(candidate=profile).select_related('job__company')
            serializer = SavedJobSerializer(saved_jobs, many=True)
            return Response(serializer.data)
        except CandidateProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class SavedJobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            job     = Job.objects.get(id=job_id)
            saved, created = SavedJob.objects.get_or_create(candidate=profile, job=job)
            if not created:
                return Response(
                    {'message': 'Job already saved'},
                    status=status.HTTP_200_OK
                )
            return Response(
                {'message': 'Job saved successfully'},
                status=status.HTTP_201_CREATED
            )
        except CandidateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, job_id):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            job     = Job.objects.get(id=job_id)
            saved   = SavedJob.objects.get(candidate=profile, job=job)
            saved.delete()
            return Response({'message': 'Job removed from saved'})
        except SavedJob.DoesNotExist:
            return Response({'error': 'Saved job not found'}, status=status.HTTP_404_NOT_FOUND)
        except CandidateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)