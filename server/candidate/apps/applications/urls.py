from django.urls import path
from .views import ApplicationListView, ApplicationDetailView

urlpatterns = [
    path('applications/', ApplicationListView.as_view(), name='application-list'),
    path('applications/<uuid:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
]
