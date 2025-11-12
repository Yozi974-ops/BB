from django.db import models
from django.conf import settings

class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ("apartment", "Appartement"),
        ("house", "Maison"),
        ("land", "Terrain"),
        ("commercial", "Local commercial"),
    ]

    USAGE_TYPE_CHOICES = [
        ("primary", "Résidence principale"),
        ("secondary", "Résidence secondaire"),
        ("rental", "Investissement locatif"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=255)

    type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    usage = models.CharField(max_length=20, choices=USAGE_TYPE_CHOICES)

    # Localisation
    address = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Caractéristiques principales
    living_area = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    rooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    construction_year = models.PositiveSmallIntegerField(null=True, blank=True)
    occupancy_status = models.CharField(max_length=20, blank=True)

    # Détails techniques
    dpe = models.CharField(max_length=5, blank=True)
    ges = models.CharField(max_length=5, blank=True)
    is_co_owned = models.BooleanField(default=False)
    condo_fees = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    overall_condition = models.CharField(max_length=20, blank=True)

    # Données financières
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    monthly_charges = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    property_tax = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    loan_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    loan_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    loan_duration_months = models.PositiveIntegerField(null=True, blank=True)

    gross_yield = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    net_yield = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.owner})"


class PropertyDocument(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("analyzing", "Analyzing"),
        ("analyzed", "Analyzed"),
        ("error", "Error"),
    ]

    property = models.ForeignKey(
        Property,
        related_name="documents",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    file = models.FileField(upload_to="properties/documents/")
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    extracted_data = models.JSONField(null=True, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name
