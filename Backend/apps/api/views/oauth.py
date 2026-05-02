from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import requests

from apps.users.models import UserSession
from ..serializers.auth import TokenSerializer

User = get_user_model()


class GoogleOAuthView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    
    def post(self, request, *args, **kwargs):
        """
        Exchange Google access token for JWT tokens
        """
        access_token = request.data.get('access_token')
        
        if not access_token:
            return Response(
                {'detail': 'access_token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Verify token with Google and get user info
            google_response = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            
            if google_response.status_code != 200:
                return Response(
                    {'detail': 'Invalid Google token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            google_data = google_response.json()
            email = google_data.get('email')
            name = google_data.get('name', '')
            picture = google_data.get('picture', '')
            given_name = google_data.get('given_name', '')
            family_name = google_data.get('family_name', '')
            verified_email = google_data.get('verified_email', False)
            locale = google_data.get('locale', '')
            
            if not email:
                return Response(
                    {'detail': 'Email not provided by Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'name': name or f"{given_name} {family_name}".strip() or email.split('@')[0],
                    'is_verified': verified_email or True,  # Google emails are usually verified
                }
            )
            
            # Always update user info from Google to keep it fresh
            updated = False
            if name and (not user.name or user.name != name):
                user.name = name
                updated = True
            elif not user.name and (given_name or family_name):
                user.name = f"{given_name} {family_name}".strip() or email.split('@')[0]
                updated = True
            
            # Note: Avatar field is ImageField, so we can't directly store URL
            # You might want to download the image and save it, or use a URLField
            # For now, we'll skip avatar storage via URL
            
            if verified_email and not user.is_verified:
                user.is_verified = True
                updated = True
            
            # Update last login
            user.last_login = timezone.now()
            updated = True
            
            if updated:
                user.save()
            
            # Generate JWT tokens
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
            
            # Return tokens
            token_serializer = TokenSerializer(
                data={'access': str(refresh.access_token), 'refresh': str(refresh)},
                context={'user': user}
            )
            token_serializer.is_valid()
            
            return Response(token_serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'detail': f'OAuth error: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

