from rest_framework import serializers
from .models import Roadmap, RoadmapStage, Resource, RoadmapResource


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'type', 'url', 'provider', 'rating', 'is_free', 'difficulty_level']


class RoadmapResourceSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer(read_only=True)
    
    class Meta:
        model = RoadmapResource
        fields = ['id', 'resource', 'order_in_stage', 'is_required', 'estimated_completion_days']


class RoadmapStageSerializer(serializers.ModelSerializer):
    resources = RoadmapResourceSerializer(many=True, read_only=True, source='resources.all')
    
    class Meta:
        model = RoadmapStage
        fields = ['id', 'title', 'description', 'stage_order', 'estimated_hours', 'skills_gained', 'completion_criteria', 'resources']


class RoadmapSerializer(serializers.ModelSerializer):
    stages = RoadmapStageSerializer(many=True, read_only=True, source='stages.all')
    
    class Meta:
        model = Roadmap
        fields = ['id', 'uuid', 'title', 'description', 'track', 'difficulty', 'estimated_weeks', 'stages', 'created_at', 'updated_at']
        read_only_fields = ['uuid', 'created_at', 'updated_at']
