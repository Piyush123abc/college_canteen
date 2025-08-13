from django.urls import path
from .views import StudentRegistrationView, ChefRegistrationView, simple_login

urlpatterns = [
    path('register/student/', StudentRegistrationView.as_view(), name='student-register'),
    path('register/chef/', ChefRegistrationView.as_view(), name='chef-register'),
    path('login/', simple_login, name='login'),
]
