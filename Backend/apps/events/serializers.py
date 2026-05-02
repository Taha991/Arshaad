from rest_framework import serializers
from .models import Event, EventAttendee


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['created_at', 'current_attendees']


class EventAttendeeSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), source='event', write_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = EventAttendee
        fields = '__all__'
        read_only_fields = ['registered_at']


