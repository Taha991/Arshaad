from django.db import models
from django.utils import timezone as tz
from apps.users.models import User
from apps.roadmaps.models import Roadmap


class Mentor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='mentor_profile')
    bio = models.TextField(blank=True, null=True)
    specializations = models.JSONField(default=list, blank=True)
    experience_years = models.IntegerField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    availability = models.JSONField(default=dict, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.IntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, default='EGP')
    timezone = models.CharField(max_length=50, blank=True, null=True)
    calendly_url = models.URLField(blank=True, null=True)
    zoom_link = models.URLField(blank=True, null=True)
    total_sessions = models.IntegerField(default=0)
    total_mentees = models.IntegerField(default=0)
    response_time_hours = models.IntegerField(default=24)
    languages = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    mentor_since = models.DateTimeField(default=tz.now)
    
    class Meta:
        db_table = 'mentors'
    
    def __str__(self):
        return f"Mentor: {self.user.email}"


class MentoringSession(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    SESSION_TYPE_CHOICES = [
        ('general', 'General'),
        ('technical', 'Technical'),
        ('career', 'Career'),
        ('project_review', 'Project Review'),
    ]
    
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='sessions')
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentoring_sessions')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='scheduled')
    session_type = models.CharField(max_length=50, choices=SESSION_TYPE_CHOICES, default='general')
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True, choices=[(i, i) for i in range(1, 6)])
    feedback = models.TextField(blank=True, null=True)
    payment_amount = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(default=tz.now)
    
    class Meta:
        db_table = 'mentoring_sessions'
        ordering = ['-scheduled_at']
    
    def __str__(self):
        return f"{self.mentor.user.email} - {self.mentee.email} - {self.scheduled_at}"


class StudyGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    roadmap = models.ForeignKey(Roadmap, on_delete=models.SET_NULL, null=True, blank=True, related_name='study_groups')
    mentor = models.ForeignKey(Mentor, on_delete=models.SET_NULL, null=True, blank=True, related_name='study_groups')
    max_members = models.IntegerField(default=20)
    current_members = models.IntegerField(default=0)
    meeting_schedule = models.JSONField(default=dict, blank=True)
    discord_url = models.URLField(blank=True, null=True)
    telegram_url = models.URLField(blank=True, null=True)
    whatsapp_url = models.URLField(blank=True, null=True)
    meeting_link = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    tags = models.JSONField(default=list, blank=True)
    language = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(default=tz.now)
    
    class Meta:
        db_table = 'study_groups'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class StudyGroupMember(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    ]
    
    study_group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_group_memberships')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(default=tz.now)
    is_active = models.BooleanField(default=True)
    contribution_score = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'study_group_members'
        unique_together = ['study_group', 'user']
        ordering = ['-contribution_score', 'joined_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.study_group.name} ({self.role})"


