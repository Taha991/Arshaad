from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .models import Assessment, Recommendation
from .serializers import AssessmentSerializer, RecommendationSerializer
from .services import RecommendationService
import traceback


class AssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Assessment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            raise ValidationError({'detail': f'Error creating assessment: {str(e)}'})
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            error_detail = str(e)
            if hasattr(e, 'detail'):
                error_detail = e.detail
            return Response(
                {'detail': f'Error creating assessment: {error_detail}', 'traceback': traceback.format_exc()},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def generate_recommendation(self, request, pk=None):
        try:
            assessment = self.get_object()
            service = RecommendationService()
            recommendation = service.generate_recommendation(assessment)
            serializer = RecommendationSerializer(recommendation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'detail': f'Error generating recommendation: {str(e)}', 'traceback': traceback.format_exc()},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user)


