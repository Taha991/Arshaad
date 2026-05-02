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
        else:
            # Authenticated users see their own roadmaps first
            queryset = queryset.filter(user=self.request.user) | queryset.filter(is_public=True)
        return queryset.distinct()
    
    @action(detail=False, methods=['get'])
    def my_roadmap(self, request):
        """Get current user's active roadmap"""
        roadmap = Roadmap.objects.filter(
            user=request.user,
            is_active=True
        ).order_by('-created_at').first()
        
        if not roadmap:
            return Response(
                {'detail': 'No active roadmap found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = RoadmapSerializer(roadmap)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stages(self, request, pk=None):
        roadmap = self.get_object()
        stages = roadmap.stages.all().order_by('stage_order')
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


