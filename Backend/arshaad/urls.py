from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('api/health/', health),
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
    path('api/', include('apps.roadmaps.urls')),
    path('api/', include('apps.assessments.urls')),
    path('api/', include('apps.progress.urls')),
    path('api/', include('apps.mentorship.urls')),
    path('api/', include('apps.jobs.urls')),
    path('api/', include('apps.events.urls')),
    path('api/', include('apps.notifications.urls')),
    path('api/', include('apps.discounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns.append(path('__debug__/', include('debug_toolbar.urls')))