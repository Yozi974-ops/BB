import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { ProgressHeader } from "@/src/components/ui/ProgressHeader";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { colors, spacing } from "@/src/theme";
import { useAddPropertyContext } from "@/src/context/AddPropertyContext";

const Section: React.FC<{ title: string; onEdit: () => void }> = ({ title, onEdit, children }) => (
  <Card style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text variant="h3" weight="semibold">
        {title}
      </Text>
      <Button label="Modifier" variant="ghost" onPress={onEdit} />
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </Card>
);

const SummaryRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text variant="small" color={colors.neutral[500]}>
      {label}
    </Text>
    <Text variant="body" weight="medium">
      {value ?? "—"}
    </Text>
  </View>
);

export const Step7SummaryScreen: React.FC = () => {
  const { property, totalSteps, goToStep, saveProperty } = useAddPropertyContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    goToStep(7, { persist: false });
  }, [goToStep]);

  const navigateToStep = (step: number, path: string) => {
    goToStep(step, { persist: true });
    router.push(path);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await saveProperty();
      router.replace("/add-property/success");
    } catch (error) {
      console.warn("Save property failed", error);
      Alert.alert("Impossible d’enregistrer", "Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ProgressHeader currentStep={7} totalSteps={totalSteps} label="Récapitulatif" />
      <Text variant="body" color={colors.neutral[600]}>
        Vérifiez l’ensemble des informations avant validation. Vous pourrez toujours les modifier plus tard.
      </Text>
      <Section title="Type & usage" onEdit={() => navigateToStep(1, "/add-property/step1")}>
        <SummaryRow label="Type" value={property.type ? typeLabel(property.type) : "—"} />
        <SummaryRow label="Usage" value={property.usage ? usageLabel(property.usage) : "—"} />
      </Section>
      <Section title="Localisation" onEdit={() => navigateToStep(2, "/add-property/step2")}>
        <SummaryRow label="Adresse" value={property.location.address || "—"} />
      </Section>
      <Section title="Caractéristiques" onEdit={() => navigateToStep(3, "/add-property/step3")}>
        <SummaryRow label="Surface habitable" value={formatNumber(property.mainCharacteristics.livingArea, "m²")} />
        <SummaryRow label="Pièces" value={property.mainCharacteristics.rooms?.toString() ?? "—"} />
        <SummaryRow label="Chambres" value={property.mainCharacteristics.bedrooms?.toString() ?? "—"} />
        <SummaryRow label="Année" value={property.mainCharacteristics.constructionYear?.toString() ?? "—"} />
        <SummaryRow
          label="Statut"
          value={property.mainCharacteristics.occupancyStatus === "occupied" ? "Occupé" : property.mainCharacteristics.occupancyStatus === "vacant" ? "Libre" : "—"}
        />
      </Section>
      <Section title="Détails techniques" onEdit={() => navigateToStep(4, "/add-property/step4")}>
        <SummaryRow label="DPE" value={property.technicalDetails.dpe ?? "—"} />
        <SummaryRow label="GES" value={property.technicalDetails.ges ?? "—"} />
        <SummaryRow
          label="Copropriété"
          value={
            property.technicalDetails.isCoOwned === undefined
              ? "—"
              : property.technicalDetails.isCoOwned
                ? "Oui"
                : "Non"
          }
        />
        {property.technicalDetails.isCoOwned ? (
          <SummaryRow
            label="Charges mensuelles"
            value={formatCurrency(property.technicalDetails.condoFees)}
          />
        ) : null}
        <SummaryRow label="État général" value={conditionLabel(property.technicalDetails.overallCondition)} />
      </Section>
      <Section title="Finances" onEdit={() => navigateToStep(5, "/add-property/step5")}>
        <SummaryRow label="Prix d’achat" value={formatCurrency(property.financials.purchasePrice)} />
        <SummaryRow label="Revenus locatifs" value={formatCurrency(property.financials.monthlyRent)} />
        <SummaryRow label="Charges mensuelles" value={formatCurrency(property.financials.monthlyCharges)} />
        <SummaryRow label="Taxe foncière" value={formatCurrency(property.financials.propertyTax)} />
        <SummaryRow
          label="Rentabilité brute"
          value={property.financials.grossYield ? `${property.financials.grossYield}%` : "—"}
        />
        <SummaryRow
          label="Rentabilité nette"
          value={property.financials.netYield ? `${property.financials.netYield}%` : "—"}
        />
      </Section>
      <Section title="Documents" onEdit={() => navigateToStep(6, "/add-property/step6")}>
        {property.documents.length === 0 ? (
          <Text variant="body" color={colors.neutral[600]}>
            Aucun document ajouté.
          </Text>
        ) : (
          property.documents.map((doc) => (
            <View key={doc.id} style={styles.docRow}>
              <Text variant="body" weight="medium">
                {doc.name}
              </Text>
              <Text variant="small" color={colors.neutral[500]}>
                {doc.status === "analyzed" ? "Analysé" : doc.status === "analyzing" ? "Analyse…" : doc.status === "error" ? "Erreur" : "En attente"}
              </Text>
            </View>
          ))
        )}
      </Section>
      <Button label="Ajouter mon bien" onPress={handleSubmit} loading={loading} />
    </ScreenContainer>
  );
};

const typeLabel = (type?: string) => {
  switch (type) {
    case "apartment":
      return "Appartement";
    case "house":
      return "Maison";
    case "land":
      return "Terrain";
    case "commercial":
      return "Local";
    default:
      return "—";
  }
};

const usageLabel = (usage?: string) => {
  switch (usage) {
    case "primary":
      return "Résidence principale";
    case "secondary":
      return "Résidence secondaire";
    case "rental":
      return "Investissement locatif";
    default:
      return "—";
  }
};

const conditionLabel = (condition?: string) => {
  switch (condition) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Bon";
    case "average":
      return "Moyen";
    case "renovate":
      return "À rénover";
    default:
      return "—";
  }
};

const formatCurrency = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
};

const formatNumber = (value?: number, suffix?: string) => {
  if (value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return `${value}${suffix ? ` ${suffix}` : ""}`;
};

const styles = StyleSheet.create({
  sectionCard: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionContent: {
    gap: spacing.sm,
  },
  row: {
    gap: spacing.xs,
  },
  docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xs,
  },
});

export default Step7SummaryScreen;
