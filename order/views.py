from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from users.models import Student, Chef
from .models import Order
from .serializer import OrderSerializer

# -----------------------
# Student creates an order
# -----------------------
@api_view(['POST'])
def create_order(request):
    username = request.headers.get('X-Username')
    password = request.headers.get('X-Password')

    user = authenticate(username=username, password=password)
    if not user or not hasattr(user, 'student'):
        return Response({"success": False, "message": "Only students can place orders"}, status=403)
    
    student = user.student
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(student=student)  # assign student automatically
        return Response({"success": True, "order": serializer.data})
    else:
        return Response({"success": False, "errors": serializer.errors}, status=400)

# -----------------------
# Chef views latest orders
# -----------------------
@api_view(['GET'])
def latest_orders(request):
    username = request.headers.get('X-Username')
    password = request.headers.get('X-Password')

    user = authenticate(username=username, password=password)
    if not user or not hasattr(user, 'chef'):
        return Response({"success": False, "message": "Only chefs can view orders"}, status=403)

    orders = Order.objects.all().order_by('-ordered_at')[:10]  # latest 10 orders
    serializer = OrderSerializer(orders, many=True)
    return Response({"success": True, "orders": serializer.data})
