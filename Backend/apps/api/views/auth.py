from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

from apps.users.models import UserSession, AuthToken
from ..serializers.auth import (
    RegisterSerializer,
    LoginSerializer,
    TokenSerializer,
    LogoutSerializer,
    VerifyEmailSerializer,
    ResetPasswordRequestSerializer,
    ResetPasswordConfirmSerializer
)


class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Store refresh token
        expires_at = timezone.now() + timedelta(days=1)
        UserSession.objects.create(
            user=user,
            refresh_token=str(refresh),
            device_info=request.data.get('device_info', {}),
            ip_address=self.get_client_ip(request),
            expires_at=expires_at
        )
        
        # Return tokens and user data
        token_serializer = TokenSerializer(
            data={'access': str(refresh.access_token), 'refresh': str(refresh)},
            context={'user': user}
        )
        token_serializer.is_valid()
        
        return Response(token_serializer.data, status=status.HTTP_201_CREATED)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if user is None:
            return Response(
                {'detail': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'detail': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Update last login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Store refresh token
        expires_at = timezone.now() + timedelta(days=1)
        UserSession.objects.create(
            user=user,
            refresh_token=str(refresh),
            device_info=serializer.validated_data.get('device_info', {}),
            ip_address=self.get_client_ip(request),
            expires_at=expires_at
        )
        
        # Return tokens and user data
        token_serializer = TokenSerializer(
            data={'access': str(refresh.access_token), 'refresh': str(refresh)},
            context={'user': user}
        )
        token_serializer.is_valid()
        
        return Response(token_serializer.data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LogoutSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # Invalidate the refresh token
            session = UserSession.objects.get(
                refresh_token=serializer.validated_data['refresh'],
                user=request.user
            )
            session.is_active = False
            session.save()
            
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserSession.DoesNotExist:
            return Response(
                {'detail': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyEmailView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = VerifyEmailSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        user = token.user
        
        # Mark user as verified
        user.is_verified = True
        user.save()
        
        # Mark token as used
        token.is_used = True
        token.save()
        
        return Response({'detail': 'Email verified successfully'})


class ResetPasswordRequestView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordRequestSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['email']
        
        # Create password reset token
        token_expiry = timezone.now() + timedelta(days=1)
        AuthToken.objects.create(
            user=user,
            token_type='password_reset',
            expires_at=token_expiry
        )
        
        # In a real application, send an email with the token
        
        return Response({'detail': 'Password reset email sent'})


class ResetPasswordConfirmView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordConfirmSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token_obj']
        user = token.user
        
        # Set new password
        user.set_password(serializer.validated_data['password'])
        user.save()
        
        # Mark token as used
        token.is_used = True
        token.save()
        
        return Response({'detail': 'Password reset successful'})