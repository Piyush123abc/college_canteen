from django.contrib.auth.models import User
from django.db import models

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=15, blank=True)
    def __str__(self):
        return f"{self.user.username} ({self.roll_number})"
    
    


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=50, blank=True)  # Optional: chef’s specialty
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.username} (Chef)"
