from django.contrib import admin
from .models import Request

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ("id","title","creator","is_active","created_at")
    search_fields = ("title","creator__username")
