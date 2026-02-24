import React from "react";
import { StyleSheet } from "react-native";
import { ScreenContainer } from "@/src/components/shared/layout/ScreenContainer";
import { Text } from "@/src/components/shared/ui/Text";
import { Card } from "@/src/components/shared/ui/Card";
import { spacing } from "@/src/theme";
import BackButton from "@/src/components/shared/navigation/BackButton";

const LegalScreen: React.FC = () => (
  <ScreenContainer showProfileButton={false}>
    <BackButton />
    <Text variant="h1" weight="bold" style={styles.title}>
      Informations légales
    </Text>

    <Card style={styles.card}>
      <Text variant="h3" weight="semibold">
        Mentions légales
      </Text>
      <Text variant="body">
        (Raison sociale, adresse, SIRET, responsable de publication, etc.)
      </Text>
    </Card>

    <Card style={styles.card}>
      <Text variant="h3" weight="semibold">
        Conditions Générales d’Utilisation
      </Text>
      <Text variant="body">
        (Lien ou texte vers vos CGU.)
      </Text>
    </Card>

    <Card style={styles.card}>
      <Text variant="h3" weight="semibold">
        Politique de confidentialité
      </Text>
      <Text variant="body">
        (Traitement des données, RGPD, droits utilisateurs.)
      </Text>
    </Card>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
});

export default LegalScreen;
