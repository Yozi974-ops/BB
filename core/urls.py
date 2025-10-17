from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import RequestViewSet, MessageViewSet

router = DefaultRouter()
router.register("requests", RequestViewSet, basename="request")

nested = NestedDefaultRouter(router, "requests", lookup="request")
nested.register("messages", MessageViewSet, basename="request-messages")

urlpatterns = router.urls + nested.urls

