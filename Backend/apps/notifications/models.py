from django.db import models
from django.utils import timezone
from apps.users.models import User


class Notification(models.Model):
    TYPE_CHOICES = [
        ('roadmap_update', 'Roadmap Update'),
        ('mentor_message', 'Mentor Message'),
        ('job_match', 'Job Match'),
        ('event_reminder', 'Event Reminder'),
        ('achievement', 'Achievement'),
        ('study_reminder', 'Study Reminder'),
        ('group_activity', 'Group Activity'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    action_url = models.URLField(blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(blank=True, null=True)
    sent_via = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.type} - {self.title}"


class PushToken(models.Model):
    PLATFORM_CHOICES = [
        ('android', 'Android'),
        ('ios', 'iOS'),
        ('web', 'Web'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='push_tokens')
    token = models.CharField(max_length=500)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_used = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'push_tokens'
        unique_together = ['user', 'token']
    
    def __str__(self):
        return f"{self.user.email} - {self.platform}"


