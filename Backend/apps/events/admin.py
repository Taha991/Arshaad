from django.contrib import admin
from .models import Event, EventAttendee


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'organizer', 'country', 'city', 'starts_at', 'is_online', 'is_free']
    list_filter = ['country', 'is_online', 'is_free', 'category', 'starts_at']
    search_fields = ['title', 'description', 'organizer']


@admin.register(EventAttendee)
class EventAttendeeAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'status', 'registered_at']
    list_filter = ['status', 'registered_at']


