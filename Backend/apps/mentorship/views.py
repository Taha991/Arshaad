from rest_framework import viewsets, permissions
from .models import Mentor, MentoringSession, StudyGroup, StudyGroupMember
from .serializers import MentorSerializer, MentoringSessionSerializer, StudyGroupSerializer, StudyGroupMemberSerializer


class MentorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Mentor.objects.filter(is_available=True, is_verified=True)
    serializer_class = MentorSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['specializations', 'languages', 'is_available']


class MentoringSessionViewSet(viewsets.ModelViewSet):
    serializer_class = MentoringSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'mentor':
            return MentoringSession.objects.filter(mentor__user=user)
        return MentoringSession.objects.filter(mentee=user)


class StudyGroupViewSet(viewsets.ModelViewSet):
    queryset = StudyGroup.objects.filter(is_active=True)
    serializer_class = StudyGroupSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['is_public', 'language', 'tags']


class StudyGroupMemberViewSet(viewsets.ModelViewSet):
    serializer_class = StudyGroupMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return StudyGroupMember.objects.filter(user=self.request.user)


