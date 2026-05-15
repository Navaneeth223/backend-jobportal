from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CandidateProfile, CandidateEducation, CandidateExperience
from .serializers import CandidateProfileSerializer, CandidateEducationSerializer, CandidateExperienceSerializer
from datetime import datetime

def parse_date(date_str):
    if not date_str:
        return None
    date_str = str(date_str).strip()
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        pass
    if len(date_str) == 4 and date_str.isdigit():
        return datetime.strptime(date_str, '%Y').date()
    for fmt in ('%b %Y', '%B %Y', '%m/%Y', '%m-%Y'):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            pass
    return datetime.today().date()


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
        # If profile exists already, just update it
        existing = CandidateProfile.objects.filter(user=request.user).first()
        if existing:
            serializer = CandidateProfileSerializer(existing, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class CandidateEducationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            data = request.data.copy()
            
            # Convert dates
            if 'start_date' in data or 'from' in data:
                val = data.get('start_date') or data.get('from')
                parsed = parse_date(val)
                data['start_date'] = parsed if parsed else datetime.today().date()
            else:
                data['start_date'] = datetime.today().date()
                
            if 'end_date' in data or 'to' in data:
                val = data.get('end_date') or data.get('to')
                data['end_date'] = parse_date(val)
                
            # map 'grade' to 'cgpa' if passed from frontend
            if 'grade' in data and not 'cgpa' in data:
                try:
                    data['cgpa'] = float(data['grade'])
                except ValueError:
                    data['cgpa'] = None

            serializer = CandidateEducationSerializer(data=data)
            if serializer.is_valid():
                serializer.save(candidate=profile)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CandidateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            edu = CandidateEducation.objects.get(pk=pk, candidate=profile)
            edu.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (CandidateProfile.DoesNotExist, CandidateEducation.DoesNotExist):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class CandidateExperienceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            data = request.data.copy()
            
            # Convert dates
            if 'start_date' in data or 'from' in data:
                val = data.get('start_date') or data.get('from')
                parsed = parse_date(val)
                data['start_date'] = parsed if parsed else datetime.today().date()
            else:
                data['start_date'] = datetime.today().date()
                
            if 'end_date' in data or 'to' in data:
                val = data.get('end_date') or data.get('to')
                data['end_date'] = parse_date(val)
                
            serializer = CandidateExperienceSerializer(data=data)
            if serializer.is_valid():
                serializer.save(candidate=profile)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CandidateProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
            exp = CandidateExperience.objects.get(pk=pk, candidate=profile)
            exp.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (CandidateProfile.DoesNotExist, CandidateExperience.DoesNotExist):
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)