from django.db import models
from django.utils import timezone
import uuid

from apps.core.models.users import User


class AIModel(models.Model):
    MODEL_TYPE_CHOICES = (
        ('text', 'Text Generation'),
        ('image', 'Image Generation'),
        ('audio', 'Audio Processing'),
        ('video', 'Video Processing'),
    )
    
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPE_CHOICES)
    version = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - v{self.version}"


class AISession(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_sessions')
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name='sessions')
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.ai_model.name} - {self.created_at}"
    
    def end_session(self):
        self.ended_at = timezone.now()
        self.is_active = False
        self.save()


class AIInteraction(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    session = models.ForeignKey(AISession, on_delete=models.CASCADE, related_name='interactions')
    prompt = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.session.user.email} - {self.created_at}"