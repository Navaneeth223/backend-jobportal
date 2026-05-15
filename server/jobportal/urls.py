from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/', include('users.urls')),

    # Candidate
    path('api/candidates/', include('candidate.apps.profiles.urls')),
    path('api/candidates/', include('candidate.apps.saved_jobs.urls')),
]