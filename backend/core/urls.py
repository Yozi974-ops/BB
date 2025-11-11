from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import RequestViewSet, MessageViewSet
from django.contrib import admin
from django.urls import path, include
from core import views  # 👈 importe ta vue

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),  # 👈 page d’accueil = core.views.home
]

router = DefaultRouter()
router.register("requests", RequestViewSet, basename="request")

nested = NestedDefaultRouter(router, "requests", lookup="request")
nested.register("messages", MessageViewSet, basename="request-messages")

urlpatterns = router.urls + nested.urls

