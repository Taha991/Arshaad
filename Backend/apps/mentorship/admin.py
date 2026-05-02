from django.contrib import admin
from .models import Mentor, MentoringSession, StudyGroup, StudyGroupMember


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ['user', 'job_title', 'company', 'rating', 'is_available', 'is_verified']
    list_filter = ['is_available', 'is_verified', 'rating']
    search_fields = ['user__email', 'user__name', 'company']


@admin.register(MentoringSession)
class MentoringSessionAdmin(admin.ModelAdmin):
    list_display = ['mentor', 'mentee', 'scheduled_at', 'status', 'session_type', 'rating']
    list_filter = ['status', 'session_type', 'scheduled_at']
    search_fields = ['mentor__user__email', 'mentee__email']


@admin.register(StudyGroup)
class StudyGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'mentor', 'current_members', 'max_members', 'is_active', 'is_public']
    list_filter = ['is_active', 'is_public', 'language']


@admin.register(StudyGroupMember)
class StudyGroupMemberAdmin(admin.ModelAdmin):
    list_display = ['study_group', 'user', 'role', 'is_active', 'contribution_score']
    list_filter = ['role', 'is_active']


