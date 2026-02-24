import React from "react";
import { StyleSheet, View, Switch } from "react-native";
import { ScreenContainer } from "@/src/components/shared/layout/ScreenContainer";
import { Card } from "@/src/components/shared/ui/Card";
import { Text } from "@/src/components/shared/ui/Text";
import { Button } from "@/src/components/shared/ui/Button";
import { colors, spacing } from "@/src/theme";
import { router } from "expo-router";
import { useAppMode } from "@/src/context/AppModeContext";
import { PALETTE } from "@/src/components/owner/home/styles";

// ------------------------------------------------------------
// SectionCard component
// ------------------------------------------------------------
const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  route?: string;
}> = ({ title, subtitle, route }) => {
  const handlePress = () => {
    if (route) router.push(route);
  };

  return (
    <Card style={styles.sectionCard}>
      <View style={{ flex: 1 }}>
        <Text variant="h3" weight="semibold">
          {title}
        </Text>
        {subtitle && (
          <Text variant="small" color={colors.neutral[600]}>
            {subtitle}
          </Text>
        )}
      </View>
      {route && (
        <Button
          label="Ouvrir"
          size="small"
          variant="ghost"
          onPress={handlePress}
        />
      )}
    </Card>
  );
};

// ------------------------------------------------------------
// MAIN PROFILE SCREEN (WITH TOGGLE + SECTIONS)
// ------------------------------------------------------------
export default function ProfileScreen() {
  const { mode, setMode } = useAppMode();
  const isArtisan = mode === "artisan";

  return (
    <ScreenContainer title="Profil" showProfileButton={false}>
      {/* ----- MODE SWITCH ----- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mode d’affichage</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Activer la vue artisan</Text>
            <Text style={styles.helper}>
              Permet d’accéder aux annonces de travaux en tant qu’artisan.
            </Text>
          </View>

          <Switch
            value={isArtisan}
            onValueChange={(value) => {
              setMode(value ? "artisan" : "owner");
              router.replace("/"); // Recharger Home appropriée
            }}
            thumbColor={isArtisan ? PALETTE.primary : "#fff"}
            trackColor={{ false: "#ccc", true: "#b9c4ff" }}
          />
        </View>
      </View>

      {/* ----- PROFILE HEADER ----- */}
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Mon profil
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Gérez votre compte, vos biens et vos services depuis cet espace.
        </Text>
      </View>

      {/* ----- CARDS ----- */}
      <SectionCard
        title="Informations personnelles"
        subtitle="Nom, email, coordonnées, mot de passe."
        route="/profile/personal"
      />
      <SectionCard
        title="Mes biens immobiliers"
        subtitle="Consultez et gérez vos biens enregistrés."
        route="/profile/properties"
      />
      <SectionCard
        title="Mes annonces"
        subtitle="Biens publiés, statut des annonces."
        route="/profile/listings"
      />
      <SectionCard
        title="Récapitulatif des prestations"
        subtitle="Historique des prestations, rapports, factures."
        route="/profile/services"
      />
      <SectionCard
        title="Paramètres"
        subtitle="Préférences, notifications, langue."
        route="/profile/settings"
      />
      <SectionCard
        title="À propos d’Immio"
        subtitle="Notre mission et notre équipe."
        route="/profile/about"
      />
      <SectionCard
        title="Informations légales"
        subtitle="CGU, politique de confidentialité, mentions légales."
        route="/profile/legal"
      />
      <SectionCard
        title="Guide d’utilisation"
        subtitle="Comment utiliser l’application pas à pas."
        route="/profile/guide"
      />
    </ScreenContainer>
  );
}

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PALETTE.ink,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: PALETTE.ink,
  },
  helper: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
