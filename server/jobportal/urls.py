from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/', include('users.urls')),

    # Jobs
    path('api/jobs/', include('company.apps.jobs.urls')),

    # Candidate
    path('api/candidates/', include('candidate.apps.profiles.urls')),
    path('api/candidates/', include('candidate.apps.saved_jobs.urls')),
    path('api/candidates/', include('candidate.apps.applications.urls')),

    # Notifications
    path('api/notifications/', include('notifications.urls')),

    # Messaging
    path('api/conversations/', include('messaging.urls')),
]