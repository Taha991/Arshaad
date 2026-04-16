from django.contrib import admin
from .models import Discount, UserDiscountUsage


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ['provider', 'course_title', 'discount_percentage', 'is_active', 'current_uses', 'expires_at']
    list_filter = ['is_active', 'provider', 'expires_at']
    search_fields = ['provider', 'course_title', 'discount_code']


@admin.register(UserDiscountUsage)
class UserDiscountUsageAdmin(admin.ModelAdmin):
    list_display = ['user', 'discount', 'used_at']
    list_filter = ['used_at']


