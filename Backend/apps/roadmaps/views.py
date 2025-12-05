from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Roadmap, RoadmapStage, Resource
from .serializers import RoadmapSerializer, RoadmapStageSerializer, ResourceSerializer


class RoadmapViewSet(viewsets.ModelViewSet):
    queryset = Roadmap.objects.all()
    serializer_class = RoadmapSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Roadmap.objects.all()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_public=True)
        return queryset
    
    @action(detail=True, methods=['get'])
    def stages(self, request, pk=None):
        roadmap = self.get_object()
        stages = roadmap.stages.all()
        serializer = RoadmapStageSerializer(stages, many=True)
        return Response(serializer.data)


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.filter(status='active')
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['type', 'is_free', 'difficulty_level', 'language']


class RoadmapStageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RoadmapStage.objects.all()
    serializer_class = RoadmapStageSerializer
    permission_classes = [permissions.AllowAny]


