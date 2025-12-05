from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Assessment, Recommendation
from .serializers import AssessmentSerializer, RecommendationSerializer
from .services import RecommendationService


class AssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Assessment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def generate_recommendation(self, request, pk=None):
        assessment = self.get_object()
        service = RecommendationService()
        recommendation = service.generate_recommendation(assessment)
        serializer = RecommendationSerializer(recommendation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user)


