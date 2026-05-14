from django.apps import AppConfig

class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'candidate.apps.profiles'
    label = 'candidate_profiles'        # ← this is the fix