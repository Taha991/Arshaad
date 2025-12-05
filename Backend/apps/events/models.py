from django.db import models
from django.utils import timezone
from apps.users.models import User


class Event(models.Model):
    external_id = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    organizer = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default='EG')
    venue = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.BooleanField(default=False)
    is_free = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, default='EGP')
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(blank=True, null=True)
    registration_url = models.URLField(blank=True, null=True)
    event_url = models.URLField(blank=True, null=True)
    max_attendees = models.IntegerField(blank=True, null=True)
    current_attendees = models.IntegerField(default=0)
    skills_focus = models.JSONField(default=list, blank=True)
    target_audience = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'events'
        ordering = ['starts_at']
        indexes = [
            models.Index(fields=['starts_at']),
            models.Index(fields=['country', 'city']),
            models.Index(fields=['is_online']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.starts_at}"


class EventAttendee(models.Model):
    STATUS_CHOICES = [
        ('interested', 'Interested'),
        ('registered', 'Registered'),
        ('attended', 'Attended'),
        ('cancelled', 'Cancelled'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_attendances')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='interested')
    registered_at = models.DateTimeField(default=timezone.now)
    attended_at = models.DateTimeField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True, choices=[(i, i) for i in range(1, 6)])
    feedback = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'event_attendees'
        unique_together = ['event', 'user']
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.event.title} - {self.status}"


