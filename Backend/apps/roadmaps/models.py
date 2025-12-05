import uuid
from django.db import models
from django.utils import timezone
from apps.users.models import User


class Roadmap(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    estimated_weeks = models.IntegerField(default=12)
    prerequisites = models.JSONField(default=list, blank=True)
    learning_objectives = models.JSONField(default=list, blank=True)
    career_tracks = models.JSONField(default=list, blank=True)
    popularity_score = models.IntegerField(default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roadmaps', null=True, blank=True)
    track = models.CharField(max_length=100, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_roadmaps')
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'roadmaps'
        ordering = ['-popularity_score', '-created_at']
    
    def __str__(self):
        return self.title


class RoadmapStage(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name='stages')
    stage_order = models.IntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    goals = models.TextField(blank=True, null=True)
    estimated_hours = models.IntegerField(default=20)
    skills_gained = models.JSONField(default=list, blank=True)
    completion_criteria = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'roadmap_stages'
        ordering = ['stage_order']
        unique_together = ['roadmap', 'stage_order']
    
    def __str__(self):
        return f"{self.roadmap.title} - Stage {self.stage_order}: {self.title}"


class Resource(models.Model):
    TYPE_CHOICES = [
        ('book', 'Book'),
        ('video', 'Video'),
        ('course', 'Course'),
        ('tool', 'Tool'),
        ('article', 'Article'),
        ('podcast', 'Podcast'),
        ('github', 'GitHub Repository'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('broken', 'Broken'),
        ('deprecated', 'Deprecated'),
        ('pending_review', 'Pending Review'),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=100, blank=True, null=True)
    url = models.URLField()
    thumbnail_url = models.URLField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.IntegerField(default=0)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, blank=True, null=True)
    is_free = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, default='USD')
    estimated_duration_hours = models.IntegerField(blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    subtitles_available = models.JSONField(default=list, blank=True)
    prerequisites = models.JSONField(default=list, blank=True)
    skills_covered = models.JSONField(default=list, blank=True)
    last_checked = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'resources'
        ordering = ['-rating', '-review_count']
    
    def __str__(self):
        return f"{self.type}: {self.title}"


class RoadmapResource(models.Model):
    roadmap_stage = models.ForeignKey(RoadmapStage, on_delete=models.CASCADE, related_name='resources')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='roadmap_assignments')
    is_required = models.BooleanField(default=True)
    order_in_stage = models.IntegerField(default=1)
    estimated_completion_days = models.IntegerField(default=3)
    
    class Meta:
        db_table = 'roadmap_resources'
        ordering = ['order_in_stage']
        unique_together = ['roadmap_stage', 'resource']
    
    def __str__(self):
        return f"{self.roadmap_stage.title} - {self.resource.title}"


