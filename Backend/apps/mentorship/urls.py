from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MentorViewSet, MentoringSessionViewSet, StudyGroupViewSet, StudyGroupMemberViewSet

router = DefaultRouter()
router.register(r'mentors', MentorViewSet, basename='mentor')
router.register(r'sessions', MentoringSessionViewSet, basename='session')
router.register(r'study-groups', StudyGroupViewSet, basename='study-group')
router.register(r'group-members', StudyGroupMemberViewSet, basename='group-member')

urlpatterns = [
    path('', include(router.urls)),
]


