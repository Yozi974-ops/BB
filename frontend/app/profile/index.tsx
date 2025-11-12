import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { colors, spacing } from "@/src/theme";
import { router } from "expo-router";

const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  route?: string;
}> = ({ title, subtitle, route }) => {
  const handlePress = () => {
    if (route) {
      router.push(route);
    }
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

const ProfileScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Mon profil
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Gérez votre compte, vos biens et vos services depuis cet espace.
        </Text>
      </View>

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
};

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
});

export default ProfileScreen;
