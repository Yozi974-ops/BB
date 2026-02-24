from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Property, PropertyDocument
from .serializers import PropertySerializer, PropertyDocumentSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]  # 👈 pour l’instant, le temps des tests

    def get_queryset(self):
        # Si plus tard tu veux filtrer par owner connecté :
        # if self.request.user.is_authenticated:
        #     return Property.objects.filter(owner=self.request.user).order_by("-created_at")
        # return Property.objects.none()
        return Property.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save()  # 👈 on ne force plus owner ici


    @action(detail=True, methods=["post"], url_path="documents")
    def upload_document(self, request, pk=None):
        """Upload d'un document lié à un bien."""
        prop = self.get_object()
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"detail": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

        doc = PropertyDocument.objects.create(
            property=prop,
            file=uploaded_file,
            name=uploaded_file.name,
            status="pending",
        )
        return Response(PropertyDocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


class PropertyDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    """Listing/lecture des documents (optionnel)."""
    serializer_class = PropertyDocumentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return PropertyDocument.objects.filter(property__owner=self.request.user).order_by("-uploaded_at")
