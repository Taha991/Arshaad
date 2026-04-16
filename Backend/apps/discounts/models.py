from django.db import models
from django.utils import timezone
from apps.users.models import User


class Discount(models.Model):
    provider = models.CharField(max_length=100)
    course_title = models.CharField(max_length=255, blank=True, null=True)
    discount_code = models.CharField(max_length=100, blank=True, null=True)
    discount_url = models.URLField(blank=True, null=True)
    discount_percentage = models.IntegerField(blank=True, null=True)
    original_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    discounted_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, default='USD')
    valid_from = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(blank=True, null=True)
    max_uses = models.IntegerField(blank=True, null=True)
    current_uses = models.IntegerField(default=0)
    target_tracks = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'discounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.provider} - {self.course_title or 'General'} - {self.discount_percentage}%"


class UserDiscountUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='discount_usage')
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, related_name='usage_records')
    used_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'user_discount_usage'
        unique_together = ['user', 'discount']
        ordering = ['-used_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.discount.course_title or self.discount.provider}"


