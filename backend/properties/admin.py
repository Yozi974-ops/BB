from django.contrib import admin
from .models import Property, PropertyDocument

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "type", "usage", "purchase_price", "created_at")
    search_fields = ("title", "address", "owner__email")

@admin.register(PropertyDocument)
class PropertyDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "property", "status", "uploaded_at")
