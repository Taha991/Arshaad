from rest_framework import viewsets, permissions
from .models import Discount, UserDiscountUsage
from .serializers import DiscountSerializer, UserDiscountUsageSerializer


class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Discount.objects.filter(is_active=True)
    serializer_class = DiscountSerializer
    permission_classes = [permissions.AllowAny]


class UserDiscountUsageViewSet(viewsets.ModelViewSet):
    serializer_class = UserDiscountUsageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserDiscountUsage.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


