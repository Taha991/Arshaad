from rest_framework import serializers
from .models import Roadmap, RoadmapStage, Resource, RoadmapResource


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'
        read_only_fields = ['uuid', 'created_at', 'updated_at']


class RoadmapResourceSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer(read_only=True)
    resource_id = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all(), source='resource', write_only=True)
    
    class Meta:
        model = RoadmapResource
        fields = '__all__'


class RoadmapStageSerializer(serializers.ModelSerializer):
    resources = RoadmapResourceSerializer(many=True, read_only=True, source='resources.all')
    
    class Meta:
        model = RoadmapStage
        fields = '__all__'


class RoadmapSerializer(serializers.ModelSerializer):
    stages = RoadmapStageSerializer(many=True, read_only=True, source='stages.all')
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = Roadmap
        fields = '__all__'
        read_only_fields = ['uuid', 'created_at', 'updated_at', 'popularity_score']


