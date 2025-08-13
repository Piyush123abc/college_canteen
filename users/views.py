from django.shortcuts import render
from rest_framework import generics
from .models import Student, Chef
from .serializer import StudentSerializer, ChefSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
# -----------------------
# Student Registration
# -----------------------
class StudentRegistrationView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

# -----------------------
# Chef Registration
# -----------------------
class ChefRegistrationView(generics.CreateAPIView):
    queryset = Chef.objects.all()
    serializer_class = ChefSerializer

# Create your views here.

@api_view(['POST'])
def simple_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        return Response({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })
    else:
        return Response({"success": False, "message": "Invalid credentials"}, status=400)
