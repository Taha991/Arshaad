from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgressViewSet, StudySessionViewSet, AchievementViewSet,
    UserAchievementViewSet, LearningStreakViewSet
)

router = DefaultRouter()
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'sessions', StudySessionViewSet, basename='session')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')
router.register(r'streaks', LearningStreakViewSet, basename='streak')

urlpatterns = [
    path('', include(router.urls)),
]


