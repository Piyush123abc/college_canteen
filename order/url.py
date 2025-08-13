from django.urls import path
from .views import create_order, latest_orders

urlpatterns = [
    # Student creates an order
    path('create/', create_order, name='order-create'),

    # Chef views latest 10 orders
    path('latest/', latest_orders, name='order-latest'),
]
