from django.urls import path
from .views import MenuListView, add_menu_item

urlpatterns = [
    path('list/', MenuListView.as_view(), name='menu-list'),
    path('add/', add_menu_item, name='menu-add'),
]
