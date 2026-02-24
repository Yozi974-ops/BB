from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count

from .models import (
    WorkRequest,
    ArtisanProfile,
    WorkOffer,
    WorkIntervention,
    WorkMessage,
)
from .serializers import (
    WorkRequestSerializer,
    ArtisanProfileSerializer,
    WorkOfferSerializer,
    WorkInterventionSerializer,
    WorkMessageSerializer,
)


class WorkRequestViewSet(viewsets.ModelViewSet):
    queryset = WorkRequest.objects.all().prefetch_related("offers")
    serializer_class = WorkRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        city = self.request.query_params.get("city")
        tag = self.request.query_params.get("tag")

        if city:
            qs = qs.filter(city__icontains=city)
        if tag:
            qs = qs.filter(tags__contains=[tag])

        return qs.annotate(offers_count=Count("offers"))

    def perform_create(self, serializer):
        user = self.request.user
        if user and user.is_authenticated:
            serializer.save(creator=user)
        else:
            serializer.save()


class ArtisanProfileViewSet(viewsets.ModelViewSet):
    queryset = ArtisanProfile.objects.all()
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user
        if user and user.is_authenticated:
            serializer.save(user=user)
        else:
            serializer.save(user=None)


class WorkOfferViewSet(viewsets.ModelViewSet):
    queryset = WorkOffer.objects.select_related("work_request", "artisan")
    serializer_class = WorkOfferSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(artisan=user)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        """Le propriétaire accepte l'offre -> crée une intervention."""
        offer = self.get_object()
        work_request = offer.work_request

        # On refuse les autres offres
        WorkOffer.objects.filter(
            work_request=work_request
        ).exclude(id=offer.id).update(status="REJECTED")

        offer.status = "ACCEPTED"
        offer.save()

        intervention, created = WorkIntervention.objects.get_or_create(
            work_request=work_request,
            offer=offer,
            defaults={"artisan": offer.artisan},
        )
        serializer = WorkInterventionSerializer(intervention)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkInterventionViewSet(viewsets.ModelViewSet):
    queryset = WorkIntervention.objects.select_related("work_request", "artisan")
    serializer_class = WorkInterventionSerializer
    permission_classes = [permissions.AllowAny]


class WorkMessageViewSet(viewsets.ModelViewSet):
    queryset = WorkMessage.objects.select_related("intervention", "sender")
    serializer_class = WorkMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(sender=user)

    def get_queryset(self):
        qs = super().get_queryset()
        intervention_id = self.request.query_params.get("intervention")
        if intervention_id:
            qs = qs.filter(intervention_id=intervention_id)
        return qs
