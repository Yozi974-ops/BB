from django.conf import settings
from django.db import models


class WorkRequest(models.Model):
    description = models.TextField()
    city = models.CharField(max_length=255)
    max_budget = models.DecimalField(max_digits=10, decimal_places=2,
                                     null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="work_requests",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.city} - {self.description[:40]}..."


class ArtisanProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="artisan_profile",
    )
    skills = models.JSONField(default=list, blank=True)  # ex: ["Plomberie", "Électricité"]
    city = models.CharField(max_length=255, blank=True)
    radius_km = models.PositiveIntegerField(default=0)  # zone d'intervention
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2,
                                      null=True, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Artisan {self.user.email}"


class WorkOffer(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "En attente"),
        ("ACCEPTED", "Acceptée"),
        ("REJECTED", "Refusée"),
    ]

    work_request = models.ForeignKey(
        WorkRequest,
        on_delete=models.CASCADE,
        related_name="offers",
    )
    artisan = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="work_offers",
    )
    message = models.TextField(blank=True)
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2,
                                         null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES,
                              default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("work_request", "artisan")  # une offre / artisan / annonce

    def __str__(self):
        return f"Offre {self.id} pour {self.work_request_id}"


class WorkIntervention(models.Model):
    STATUS_CHOICES = [
        ("PLANNED", "Planifiée"),
        ("IN_PROGRESS", "En cours"),
        ("COMPLETED", "Terminée"),
        ("CANCELLED", "Annulée"),
    ]

    work_request = models.OneToOneField(
        WorkRequest,
        on_delete=models.CASCADE,
        related_name="intervention",
    )
    offer = models.OneToOneField(
        WorkOffer,
        on_delete=models.CASCADE,
        related_name="intervention",
    )
    artisan = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interventions",
    )
    status = models.CharField(max_length=12, choices=STATUS_CHOICES,
                              default="PLANNED")
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Intervention {self.id} ({self.status})"


class WorkMessage(models.Model):
    intervention = models.ForeignKey(
        WorkIntervention,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="work_messages",
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("created_at",)

    def __str__(self):
        return f"Msg {self.id} - {self.sender_id}"
