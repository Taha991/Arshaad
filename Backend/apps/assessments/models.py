from django.db import models
from django.utils import timezone
from apps.users.models import User


class Assessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    version = models.CharField(max_length=10, default='1.0')
    answers_json = models.JSONField()
    score_vector = models.JSONField(blank=True, null=True)
    personality_traits = models.JSONField(blank=True, null=True)
    skill_levels = models.JSONField(blank=True, null=True)
    interests_vector = models.JSONField(blank=True, null=True)
    completion_time_seconds = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'assessments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Assessment for {self.user.email} - {self.created_at}"


class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    assessment = models.ForeignKey(Assessment, on_delete=models.SET_NULL, null=True, blank=True, related_name='recommendations')
    track = models.CharField(max_length=100)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    model_version = models.CharField(max_length=50, default='v1.0')
    explanation = models.TextField(blank=True, null=True)
    alternative_tracks = models.JSONField(blank=True, null=True)
    personalization_factors = models.JSONField(blank=True, null=True)
    feedback_score = models.IntegerField(blank=True, null=True, choices=[(i, i) for i in range(1, 6)])
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'recommendations'
        ordering = ['-confidence', '-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.track} ({self.confidence}%)"


