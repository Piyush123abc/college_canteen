from rest_framework import generics, filters
from .models import MenuItem
from .serializer import MenuItemSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
# -----------------------
# Pagination class
# -----------------------
class MenuPagination(PageNumberPagination):
    page_size = 5  # items per page
    page_size_query_param = 'page_size'
    max_page_size = 50

# -----------------------
# Menu list view with pagination, filter, search
# -----------------------
class MenuListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    queryset = MenuItem.objects.filter(is_available=True)
    pagination_class = MenuPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']  # search by name or description
    ordering_fields = ['price', 'name']  # optional ordering

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)

        # Filter by Veg/Non-Veg only if provided
        is_veg = self.request.query_params.get('is_veg')
        if is_veg is not None:
            if is_veg.lower() in ['true', '1']:
                queryset = queryset.filter(is_veg=True)
            elif is_veg.lower() in ['false', '0']:
                queryset = queryset.filter(is_veg=False)
        # If is_veg is None, return all items (no filtering on veg)
        
        return queryset
    

# from rest_framework.response import Response
# from .models import MenuItem
# from .serializer import MenuItemSerializer
# from django.contrib.auth import authenticate

@api_view(['POST'])
def add_menu_item(request):
    """
    Add a new menu item. Only accessible by Chef.
    Frontend must send X-Username and X-Password headers for simple login.
    """
    username = request.headers.get('X-Username')
    password = request.headers.get('X-Password')
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"success": False, "message": "Invalid credentials"}, status=401)
    
    # Check if the user is a chef
    if not hasattr(user, 'chef'):
        return Response({"success": False, "message": "Only chefs can add menu items"}, status=403)
    
    # Serialize and create menu item
    serializer = MenuItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "menu_item": serializer.data})
    else:
        return Response({"success": False, "errors": serializer.errors}, status=400)

