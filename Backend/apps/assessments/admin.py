from django.contrib import admin
from .models import Assessment, Recommendation


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'version', 'completion_time_seconds', 'created_at']
    list_filter = ['version', 'created_at']
    search_fields = ['user__email']


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['user', 'track', 'confidence', 'model_version', 'created_at']
    list_filter = ['track', 'model_version', 'created_at']
    search_fields = ['user__email', 'track']


