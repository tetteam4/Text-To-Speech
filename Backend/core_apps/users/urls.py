from django.urls import path

from .views import CustomUserDetailApiView

urlpatterns = [
    path("api/v1/auth/user/", CustomUserDetailApiView.as_view(), name="user_details")
]
