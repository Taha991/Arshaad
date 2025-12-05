from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, JobApplication, MarketAnalytics
from .serializers import JobSerializer, JobApplicationSerializer, MarketAnalyticsSerializer


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['country', 'city', 'experience_level', 'employment_type', 'remote_ok', 'hybrid_ok']


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MarketAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MarketAnalytics.objects.all()
    serializer_class = MarketAnalyticsSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['country', 'track', 'skill']


