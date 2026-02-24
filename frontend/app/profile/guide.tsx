import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/src/components/shared/layout/ScreenContainer";
import { Text } from "@/src/components/shared/ui/Text";
import { Card } from "@/src/components/shared/ui/Card";
import { spacing, colors } from "@/src/theme";
import BackButton from "@/src/components/shared/navigation/BackButton";

const GuideScreen: React.FC = () => (
  <ScreenContainer showProfileButton={false}>
    <BackButton />
    <View style={styles.header}>
      <Text variant="h1" weight="bold">
        Guide d’utilisation
      </Text>
      <Text variant="body" color={colors.neutral[600]}>
        Les étapes clés pour tirer le meilleur parti d’Immio.
      </Text>
    </View>

    <Card style={styles.card}>
      <Text variant="h3" weight="semibold">
        1. Ajouter un bien
      </Text>
      <Text variant="body">
        Depuis l’accueil, utilisez le parcours guidé pour enregistrer un bien avec toutes ses caractéristiques.
      </Text>
    </Card>

    <Card style={styles.card}>
      <Text variant="h3" weight="semibold">
        2. Suivre vos biens
      </Text>
      <Text variant="body">
        Accédez à “Mes biens immobiliers” pour consulter vos informations, rentabilités, documents.
      </Text>
    </Card>

    <Card style={styles.card}>
      <Text variant="h3" weight="semibold">
        3. Gérer votre compte
      </Text>
      <Text variant="body">
        Modifiez vos informations personnelles, paramètres, et préférences dans la section Profil.
      </Text>
    </Card>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  card: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
});

export default GuideScreen;
