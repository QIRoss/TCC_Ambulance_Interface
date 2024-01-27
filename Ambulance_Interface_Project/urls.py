from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ambulance/', include('Ambulance_Interface.urls')),
]
