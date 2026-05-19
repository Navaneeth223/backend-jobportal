from django.urls import path
from .views import JobListView, JobDetailView, JobSkillAddView, JobSkillDeleteView

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'),
    path('<uuid:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<uuid:job_id>/skills/', JobSkillAddView.as_view(), name='job-skill-add'),
    path('<uuid:job_id>/skills/<int:pk>/', JobSkillDeleteView.as_view(), name='job-skill-delete'),
]
