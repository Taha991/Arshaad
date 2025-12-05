from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiscountViewSet, UserDiscountUsageViewSet

router = DefaultRouter()
router.register(r'discounts', DiscountViewSet, basename='discount')
router.register(r'usage', UserDiscountUsageViewSet, basename='discount-usage')

urlpatterns = [
    path('', include(router.urls)),
]


