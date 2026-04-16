from rest_framework import serializers
from .models import Discount, UserDiscountUsage


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'
        read_only_fields = ['created_at', 'current_uses']


class UserDiscountUsageSerializer(serializers.ModelSerializer):
    discount = DiscountSerializer(read_only=True)
    discount_id = serializers.PrimaryKeyRelatedField(queryset=Discount.objects.all(), source='discount', write_only=True)
    
    class Meta:
        model = UserDiscountUsage
        fields = '__all__'
        read_only_fields = ['used_at']


