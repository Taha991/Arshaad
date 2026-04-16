from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventAttendeeViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendees', EventAttendeeViewSet, basename='attendee')

urlpatterns = [
    path('', include(router.urls)),
]


