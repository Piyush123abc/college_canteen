from django.db import models

class MenuItem(models.Model):
    CATEGORY_CHOICES = (
        ('SNACK', 'Snack'),
        ('BEV', 'Beverage'),
        ('DESSERT', 'Dessert'),
        ('MAIN', 'Main Course'),
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.FloatField()
    is_available = models.BooleanField(default=True)
    is_veg = models.BooleanField(default=True)  # True = Veg, False = Non-Veg
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='MAIN')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        type_str = "Veg" if self.is_veg else "Non-Veg"
        return f"{self.name} - ₹{self.price} ({type_str}, {self.category})"
