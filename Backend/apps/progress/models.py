from django.db import models
from django.utils import timezone
from apps.users.models import User
from apps.roadmaps.models import Resource, RoadmapStage


class Progress(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
        ('skipped', 'Skipped'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_items')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='user_progress', null=True, blank=True)
    roadmap_stage = models.ForeignKey(RoadmapStage, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    progress_percentage = models.IntegerField(default=0)
    time_spent_minutes = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True, choices=[(i, i) for i in range(1, 6)])
    started_at = models.DateTimeField(blank=True, null=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    last_activity = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'progress'
        unique_together = ['user', 'resource']
        ordering = ['-last_activity']
    
    def __str__(self):
        return f"{self.user.email} - {self.resource.title if self.resource else 'Stage'} - {self.status}"


class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_sessions')
    resource = models.ForeignKey(Resource, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    duration_minutes = models.IntegerField()
    quality_rating = models.IntegerField(blank=True, null=True, choices=[(i, i) for i in range(1, 6)])
    notes = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'study_sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.duration_minutes}min - {self.created_at}"


class Achievement(models.Model):
    CATEGORY_CHOICES = [
        ('progress', 'Progress'),
        ('social', 'Social'),
        ('streak', 'Streak'),
        ('skill', 'Skill'),
        ('milestone', 'Milestone'),
    ]
    
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    criteria = models.JSONField()
    points = models.IntegerField(default=10)
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES, default='common')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'achievements'
    
    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='users')
    earned_at = models.DateTimeField(default=timezone.now)
    progress_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'user_achievements'
        unique_together = ['user', 'achievement']
        ordering = ['-earned_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.achievement.name}"


class LearningStreak(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learning_streak')
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(blank=True, null=True)
    streak_start_date = models.DateField(blank=True, null=True)
    total_study_days = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'learning_streaks'
    
    def __str__(self):
        return f"{self.user.email} - {self.current_streak} day streak"


