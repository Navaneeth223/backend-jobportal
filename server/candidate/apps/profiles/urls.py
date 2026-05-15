from django.urls import path
from .views import CandidateProfileView, ResumeUploadView

urlpatterns = [
    path('profile/',       CandidateProfileView.as_view()),
    path('resume-upload/', ResumeUploadView.as_view()),
]