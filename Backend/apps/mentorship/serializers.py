from rest_framework import serializers
from .models import Mentor, MentoringSession, StudyGroup, StudyGroupMember


class MentorSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Mentor
        fields = '__all__'
        read_only_fields = ['mentor_since', 'total_sessions', 'total_mentees']


class MentoringSessionSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.user.name', read_only=True)
    mentee_name = serializers.CharField(source='mentee.name', read_only=True)
    
    class Meta:
        model = MentoringSession
        fields = '__all__'
        read_only_fields = ['created_at']


class StudyGroupMemberSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = StudyGroupMember
        fields = '__all__'
        read_only_fields = ['joined_at']


class StudyGroupSerializer(serializers.ModelSerializer):
    members = StudyGroupMemberSerializer(many=True, read_only=True, source='members.all')
    roadmap_title = serializers.CharField(source='roadmap.title', read_only=True)
    mentor_name = serializers.CharField(source='mentor.user.name', read_only=True)
    
    class Meta:
        model = StudyGroup
        fields = '__all__'
        read_only_fields = ['created_at', 'current_members']


