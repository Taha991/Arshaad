from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()


class CompleteOnboardingView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        """
        Mark user onboarding as completed and optionally save selected track
        """
        user = request.user
        selected_track = request.data.get('selected_track')
        
        user.onboarding_completed = True
        user.save()
        
        # You can save the selected track to user preferences or recommendations
        # For now, we'll just mark onboarding as complete
        
        return Response({
            'message': 'Onboarding completed successfully',
            'onboarding_completed': True,
            'selected_track': selected_track,
        }, status=status.HTTP_200_OK)

