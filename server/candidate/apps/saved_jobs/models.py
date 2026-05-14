from django.db import models
from candidate.apps.profiles.models import CandidateProfile
from company.apps.jobs.models import Job


class SavedJob(models.Model):

    candidate  = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='saved_jobs')
    job        = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    saved_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate} saved {self.job.title}"

    class Meta:
        app_label = 'candidate_saved_jobs'
        unique_together = [('candidate', 'job')]
        ordering = ['-saved_at']