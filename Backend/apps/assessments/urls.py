from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssessmentViewSet, RecommendationViewSet

router = DefaultRouter()
router.register(r'assessments', AssessmentViewSet, basename='assessment')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')

urlpatterns = [
    path('', include(router.urls)),
]


