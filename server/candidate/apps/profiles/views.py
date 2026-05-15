from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CandidateProfile
from .serializers import CandidateProfileSerializer


class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            serializer = CandidateProfileSerializer(profile)
            return Response(serializer.data)
        except CandidateProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        existing = CandidateProfile.objects.filter(user=request.user).first()
        if existing:
            return Response(
                {'error': 'Profile already exists. Use PUT to update.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = CandidateProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CandidateProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            resume  = request.FILES.get('resume')
            if not resume:
                return Response(
                    {'error': 'No file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            profile.resume_url = resume
            profile.save()
            return Response({'message': 'Resume uploaded successfully'})
        except CandidateProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )