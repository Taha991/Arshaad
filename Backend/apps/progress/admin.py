from django.contrib import admin
from .models import Progress, StudySession, Achievement, UserAchievement, LearningStreak


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'resource', 'status', 'progress_percentage', 'last_activity']
    list_filter = ['status', 'last_activity']
    search_fields = ['user__email', 'resource__title']


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'resource', 'duration_minutes', 'quality_rating', 'created_at']
    list_filter = ['created_at', 'quality_rating']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'rarity', 'points', 'is_active']
    list_filter = ['category', 'rarity', 'is_active']


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'earned_at']
    list_filter = ['earned_at']


@admin.register(LearningStreak)
class LearningStreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'current_streak', 'longest_streak', 'total_study_days']


