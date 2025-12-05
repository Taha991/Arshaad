from django.db import models
from django.utils import timezone
from apps.users.models import User


class Job(models.Model):
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('junior', 'Junior'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior'),
        ('lead', 'Lead'),
        ('executive', 'Executive'),
    ]
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]
    
    external_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    source = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    company_logo_url = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    salary_min = models.IntegerField(blank=True, null=True)
    salary_max = models.IntegerField(blank=True, null=True)
    salary_currency = models.CharField(max_length=3, default='EGP')
    remote_ok = models.BooleanField(default=False)
    hybrid_ok = models.BooleanField(default=False)
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE_LEVEL_CHOICES, default='entry')
    employment_type = models.CharField(max_length=50, choices=EMPLOYMENT_TYPE_CHOICES, default='full_time')
    description = models.TextField(blank=True, null=True)
    requirements = models.JSONField(default=list, blank=True)
    preferred_qualifications = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
    skills_required = models.JSONField(default=list, blank=True)
    programming_languages = models.JSONField(default=list, blank=True)
    tools_technologies = models.JSONField(default=list, blank=True)
    application_url = models.URLField(blank=True, null=True)
    application_deadline = models.DateTimeField(blank=True, null=True)
    posted_at = models.DateTimeField(blank=True, null=True)
    scraped_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    view_count = models.IntegerField(default=0)
    application_count = models.IntegerField(default=0)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    
    class Meta:
        db_table = 'jobs'
        ordering = ['-match_score', '-posted_at']
        indexes = [
            models.Index(fields=['country', 'city']),
            models.Index(fields=['experience_level']),
            models.Index(fields=['is_active', 'posted_at']),
        ]
    
    def __str__(self):
        return f"{self.title} at {self.company or 'Unknown'}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('interested', 'Interested'),
        ('applied', 'Applied'),
        ('interview', 'Interview'),
        ('rejected', 'Rejected'),
        ('offer', 'Offer'),
        ('accepted', 'Accepted'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='interested')
    applied_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'job_applications'
        unique_together = ['user', 'job']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.job.title} - {self.status}"


class MarketAnalytics(models.Model):
    country = models.CharField(max_length=100)
    track = models.CharField(max_length=100)
    skill = models.CharField(max_length=100, blank=True, null=True)
    demand_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    avg_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salary_currency = models.CharField(max_length=3, blank=True, null=True)
    job_count = models.IntegerField(blank=True, null=True)
    growth_rate = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    data_date = models.DateField()
    source = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'market_analytics'
        unique_together = ['country', 'track', 'skill', 'data_date']
        ordering = ['-data_date', '-demand_score']
    
    def __str__(self):
        return f"{self.country} - {self.track} - {self.data_date}"


