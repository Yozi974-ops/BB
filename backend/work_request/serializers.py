from rest_framework import serializers
from .models import (
    WorkRequest,
    ArtisanProfile,
    WorkOffer,
    WorkIntervention,
    WorkMessage,
)


class WorkRequestSerializer(serializers.ModelSerializer):
    offers_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WorkRequest
        fields = [
            "id",
            "description",
            "city",
            "max_budget",
            "tags",
            "creator",
            "created_at",
            "offers_count",
        ]
        read_only_fields = ["id", "creator", "created_at", "offers_count"]


class ArtisanProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtisanProfile
        fields = [
            "id",
            "user",
            "skills",
            "city",
            "radius_km",
            "hourly_rate",
            "bio",
        ]
        read_only_fields = ["id", "user"]


class WorkOfferSerializer(serializers.ModelSerializer):
    artisan = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WorkOffer
        fields = [
            "id",
            "work_request",
            "artisan",
            "message",
            "proposed_price",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "artisan", "status", "created_at", "updated_at"]


class WorkInterventionSerializer(serializers.ModelSerializer):
    artisan = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WorkIntervention
        fields = [
            "id",
            "work_request",
            "offer",
            "artisan",
            "status",
            "scheduled_date",
            "completed_date",
            "notes",
        ]
        read_only_fields = ["id", "artisan"]


class WorkMessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WorkMessage
        fields = [
            "id",
            "intervention",
            "sender",
            "content",
            "created_at",
        ]
        read_only_fields = ["id", "sender", "created_at"]
