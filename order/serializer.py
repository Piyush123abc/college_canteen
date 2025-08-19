from rest_framework import serializers
from .models import Order
from canteen.serializer import MenuItemSerializer
from canteen.serializer import MenuItem
class OrderSerializer(serializers.ModelSerializer):
    # Nested representation of the menu item
    item = MenuItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        write_only=True,
        source='item'  # maps item_id to item FK
    )

    class Meta:
        model = Order
        fields = ['id', 'student', 'item', 'item_id', 'quantity', 'ordered_at', 'status']
        read_only_fields = ['id', 'student', 'item', 'ordered_at', 'status']

    def create(self, validated_data):
        student = validated_data.pop('student')
        order = Order.objects.create(student=student, **validated_data)
        return order
