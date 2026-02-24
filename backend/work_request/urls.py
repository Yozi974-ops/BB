from rest_framework.routers import DefaultRouter
from .views import (
    WorkRequestViewSet,
    ArtisanProfileViewSet,
    WorkOfferViewSet,
    WorkInterventionViewSet,
    WorkMessageViewSet,
)

router = DefaultRouter()
router.register("work-requests", WorkRequestViewSet, basename="work-request")
router.register("artisan-profiles", ArtisanProfileViewSet, basename="artisan-profile")
router.register("work-offers", WorkOfferViewSet, basename="work-offer")
router.register("work-interventions", WorkInterventionViewSet, basename="work-intervention")
router.register("work-messages", WorkMessageViewSet, basename="work-message")

urlpatterns = router.urls
