from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Chef

# -----------------------
# User Serializer (nested)
# -----------------------
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']

# -----------------------
# Student Serializer
# -----------------------

class StudentSerializer(serializers.ModelSerializer):
    # Write-only fields for creating linked User
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    # Read-only fields for response
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'roll_number', 'phone', 'username', 'password', 'email', 'user_username', 'user_email']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email', '')

        # Create linked User
        user = User.objects.create_user(username=username, password=password, email=email)
        student = Student.objects.create(user=user, **validated_data)
        return student
# -----------------------
# Chef Serializer
# -----------------------

class ChefSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Chef
        fields = ['id', 'username', 'password', 'email', 'phone']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email', '')

        user = User.objects.create_user(username=username, password=password, email=email)
        chef = Chef.objects.create(user=user, **validated_data)
        return chef