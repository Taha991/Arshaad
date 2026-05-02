from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobApplicationViewSet, MarketAnalyticsViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', JobApplicationViewSet, basename='application')
router.register(r'market-analytics', MarketAnalyticsViewSet, basename='market-analytics')

urlpatterns = [
    path('', include(router.urls)),
]


