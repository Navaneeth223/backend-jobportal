from django.urls import path
from .views import SavedJobListView, SavedJobDetailView

urlpatterns = [
    path('saved-jobs/',          SavedJobListView.as_view()),
    path('save-job/<uuid:job_id>/', SavedJobDetailView.as_view()),
]