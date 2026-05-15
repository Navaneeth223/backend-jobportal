from django.urls import path
from .views import CandidateProfileView, ResumeUploadView, CandidateEducationView, CandidateExperienceView

urlpatterns = [
    path('profile/',       CandidateProfileView.as_view()),
    path('resume-upload/', ResumeUploadView.as_view()),
    path('education/',     CandidateEducationView.as_view()),
    path('education/<int:pk>/', CandidateEducationView.as_view()),
    path('experience/',    CandidateExperienceView.as_view()),
    path('experience/<int:pk>/', CandidateExperienceView.as_view()),
]