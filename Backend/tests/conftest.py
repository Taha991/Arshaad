import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    def make_user(**kwargs):
        defaults = {
            'email': 'test@example.com',
            'password': 'testpassword123',
            'name': 'Test User',
            'role': 'student',
            'is_active': True,
        }
        defaults.update(kwargs)
        
        return User.objects.create_user(**defaults)
    return make_user


@pytest.fixture
def authenticated_client(create_user):
    user = create_user()
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    return client, user, str(refresh)