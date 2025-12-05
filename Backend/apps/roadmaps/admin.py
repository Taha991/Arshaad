from django.contrib import admin
from .models import Roadmap, RoadmapStage, Resource, RoadmapResource


@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'popularity_score', 'is_public', 'is_featured', 'created_at']
    list_filter = ['difficulty', 'is_public', 'is_featured', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['uuid', 'created_at', 'updated_at']


@admin.register(RoadmapStage)
class RoadmapStageAdmin(admin.ModelAdmin):
    list_display = ['title', 'roadmap', 'stage_order', 'estimated_hours']
    list_filter = ['roadmap']
    ordering = ['roadmap', 'stage_order']


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'provider', 'is_free', 'rating', 'status']
    list_filter = ['type', 'is_free', 'status', 'difficulty_level']
    search_fields = ['title', 'provider']


@admin.register(RoadmapResource)
class RoadmapResourceAdmin(admin.ModelAdmin):
    list_display = ['roadmap_stage', 'resource', 'is_required', 'order_in_stage']
    list_filter = ['is_required']


