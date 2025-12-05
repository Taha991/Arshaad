from django.contrib import admin
from .models import Job, JobApplication, MarketAnalytics


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'country', 'city', 'experience_level', 'is_active', 'posted_at']
    list_filter = ['country', 'experience_level', 'employment_type', 'is_active', 'remote_ok']
    search_fields = ['title', 'company', 'description']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']


@admin.register(MarketAnalytics)
class MarketAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['country', 'track', 'skill', 'demand_score', 'avg_salary', 'data_date']
    list_filter = ['country', 'track', 'data_date']


