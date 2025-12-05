from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import uuid
from apps.users.models import AuthToken, UserSession

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'password_confirm', 'role')
        extra_kwargs = {
            'role': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # Create verification token
        token_expiry = timezone.now() + timedelta(days=1)
        AuthToken.objects.create(
            user=user,
            token_type='email_verification',
            expires_at=token_expiry
        )
        
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})
    device_info = serializers.JSONField(required=False, default=dict)


class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = serializers.SerializerMethodField()
    
    def get_user(self, obj):
        user = self.context['user']
        return {
            'id': user.id,
            'uuid': str(user.uuid),
            'email': user.email,
            'name': user.name or user.email.split('@')[0],
            'role': user.role,
            'is_verified': user.is_verified,
            'avatar': user.avatar.url if user.avatar else None,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    
    def validate_token(self, value):
        try:
            token = AuthToken.objects.get(
                token=value,
                token_type='email_verification',
                is_used=False,
                expires_at__gt=timezone.now()
            )
            return token
        except AuthToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired token.")


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            return User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")


class ResetPasswordConfirmSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    password = serializers.CharField(style={'input_type': 'password'})
    password_confirm = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        try:
            token = AuthToken.objects.get(
                token=attrs['token'],
                token_type='password_reset',
                is_used=False,
                expires_at__gt=timezone.now()
            )
            attrs['token_obj'] = token
            return attrs
        except AuthToken.DoesNotExist:
            raise serializers.ValidationError({"token": "Invalid or expired token."})