from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from apps.assessments.models import Recommendation
from apps.roadmaps.services import RoadmapService

User = get_user_model()


class CompleteOnboardingView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        """
        Mark user onboarding as completed, save selected track, and create initial roadmap
        """
        user = request.user
        selected_track = request.data.get('selected_track')
        
        if not selected_track:
            return Response(
                {'detail': 'selected_track is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark onboarding as complete
        user.onboarding_completed = True
        user.save()
        
        # Get the latest recommendation for this user
        latest_recommendation = Recommendation.objects.filter(
            user=user
        ).order_by('-created_at').first()
        
        # Update recommendation if it matches the selected track
        if latest_recommendation and latest_recommendation.track == selected_track:
            # Track already saved in recommendation
            pass
        else:
            # Create a new recommendation record for the selected track
            Recommendation.objects.create(
                user=user,
                track=selected_track,
                confidence=100.0,  # User explicitly selected it
                model_version='user-selected',
                explanation=f'المسار المختار بواسطة المستخدم: {selected_track}'
            )
        
        # Create initial roadmap for the selected track
        roadmap_service = RoadmapService()
        roadmap = roadmap_service.create_user_roadmap(user, selected_track)
        
        return Response({
            'message': 'Onboarding completed successfully',
            'onboarding_completed': True,
            'selected_track': selected_track,
            'roadmap_id': roadmap.id if roadmap else None,
        }, status=status.HTTP_200_OK)

