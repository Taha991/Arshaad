from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoadmapViewSet, ResourceViewSet, RoadmapStageViewSet

router = DefaultRouter()
router.register(r'roadmaps', RoadmapViewSet, basename='roadmap')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'stages', RoadmapStageViewSet, basename='stage')

urlpatterns = [
    path('', include(router.urls)),
]


