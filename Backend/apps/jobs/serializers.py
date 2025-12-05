from rest_framework import serializers
from .models import Job, JobApplication, MarketAnalytics


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['scraped_at', 'view_count', 'application_count']


class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all(), source='job', write_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['applied_at']


class MarketAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketAnalytics
        fields = '__all__'
        read_only_fields = ['created_at']


