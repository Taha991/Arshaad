import pytest
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from apps.users.models import AuthToken, UserSession


@pytest.mark.django_db
class TestRegistration:
    def test_register_success(self, api_client):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'name': 'New User',
            'password': 'securepassword123',
            'password_confirm': 'securepassword123',
            'role': 'student'
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == 'newuser@example.com'
        assert response.data['user']['role'] == 'student'
    
    def test_register_duplicate_email(self, api_client, create_user):
        # Create a user first
        create_user(email='existing@example.com')
        
        url = reverse('register')
        data = {
            'email': 'existing@example.com',
            'name': 'Duplicate User',
            'password': 'securepassword123',
            'password_confirm': 'securepassword123',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
    
    def test_register_password_mismatch(self, api_client):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'name': 'New User',
            'password': 'securepassword123',
            'password_confirm': 'differentpassword',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, create_user):
        # Create a user
        user = create_user(email='login@example.com', password='loginpassword123')
        
        url = reverse('login')
        data = {
            'email': 'login@example.com',
            'password': 'loginpassword123',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == 'login@example.com'
        
        # Check that last_login was updated
        user.refresh_from_db()
        assert user.last_login is not None
    
    def test_login_wrong_password(self, api_client, create_user):
        # Create a user
        create_user(email='login@example.com', password='loginpassword123')
        
        url = reverse('login')
        data = {
            'email': 'login@example.com',
            'password': 'wrongpassword',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_inactive_user(self, api_client, create_user):
        # Create an inactive user
        create_user(email='inactive@example.com', password='loginpassword123', is_active=False)
        
        url = reverse('login')
        data = {
            'email': 'inactive@example.com',
            'password': 'loginpassword123',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestJWTRefresh:
    def test_refresh_token(self, api_client, authenticated_client):
        _, _, refresh_token = authenticated_client
        
        url = reverse('token_refresh')
        data = {
            'refresh': refresh_token,
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' not in response.data  # Simple JWT doesn't return a new refresh token by default
    
    def test_refresh_token_invalid(self, api_client):
        url = reverse('token_refresh')
        data = {
            'refresh': 'invalid-token',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLogout:
    def test_logout_success(self, api_client, authenticated_client):
        client, user, refresh_token = authenticated_client
        
        # Create a user session
        UserSession.objects.create(
            user=user,
            refresh_token=refresh_token,
            expires_at=timezone.now() + timedelta(days=1),
        )
        
        url = reverse('logout')
        data = {
            'refresh': refresh_token,
        }
        
        response = client.post(url, data)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Check that the session is marked as inactive
        session = UserSession.objects.get(refresh_token=refresh_token)
        assert not session.is_active
    
    def test_logout_invalid_token(self, api_client, authenticated_client):
        client, _, _ = authenticated_client
        
        url = reverse('logout')
        data = {
            'refresh': 'invalid-token',
        }
        
        response = client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestEmailVerification:
    def test_verify_email_success(self, api_client, create_user):
        user = create_user(is_verified=False)
        
        # Create verification token
        token = AuthToken.objects.create(
            user=user,
            token_type='email_verification',
            expires_at=timezone.now() + timedelta(days=1),
        )
        
        url = reverse('verify_email')
        data = {
            'token': token.token,
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check that user is verified and token is used
        user.refresh_from_db()
        token.refresh_from_db()
        assert user.is_verified
        assert token.is_used
    
    def test_verify_email_invalid_token(self, api_client):
        url = reverse('verify_email')
        data = {
            'token': '00000000-0000-0000-0000-000000000000',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPasswordReset:
    def test_reset_password_request(self, api_client, create_user):
        user = create_user()
        
        url = reverse('reset_password_request')
        data = {
            'email': user.email,
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check that a token was created
        assert AuthToken.objects.filter(user=user, token_type='password_reset').exists()
    
    def test_reset_password_confirm(self, api_client, create_user):
        user = create_user()
        
        # Create reset token
        token = AuthToken.objects.create(
            user=user,
            token_type='password_reset',
            expires_at=timezone.now() + timedelta(days=1),
        )
        
        url = reverse('reset_password_confirm')
        data = {
            'token': token.token,
            'password': 'newpassword123',
            'password_confirm': 'newpassword123',
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        
        # Check that token is used
        token.refresh_from_db()
        assert token.is_used
        
        # Check that password was changed
        user.refresh_from_db()
        assert user.check_password('newpassword123')