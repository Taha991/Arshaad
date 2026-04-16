from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views.auth import (
    RegisterView, 
    LoginView, 
    LogoutView, 
    VerifyEmailView, 
    ResetPasswordRequestView,
    ResetPasswordConfirmView
)
from .views.oauth import GoogleOAuthView
from .views.onboarding import CompleteOnboardingView

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('auth/reset-password/', ResetPasswordRequestView.as_view(), name='reset_password_request'),
    path('auth/reset-password/confirm/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),
    
    # OAuth endpoints
    path('auth/oauth/google/', GoogleOAuthView.as_view(), name='google_oauth'),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/oauth/', include('dj_rest_auth.registration.urls')),
    
    # Onboarding
    path('onboarding/complete/', CompleteOnboardingView.as_view(), name='complete_onboarding'),
]