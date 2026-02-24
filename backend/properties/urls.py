from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, PropertyDocumentViewSet

router = DefaultRouter()
router.register("properties", PropertyViewSet, basename="property")
router.register("property-documents", PropertyDocumentViewSet, basename="property-document")

urlpatterns = router.urls
