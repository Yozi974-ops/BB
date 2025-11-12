import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { spacing, colors } from "@/src/theme";
import BackButton from "@/src/components/navigation/BackButton";

const ServicesRecapScreen: React.FC = () => (
  <ScreenContainer showProfileButton={false}>
    <BackButton />
    <View style={styles.header}>
      <Text variant="h1" weight="bold">
        Récapitulatif des prestations
      </Text>
      <Text variant="body" color={colors.neutral[600]}>
        Historique des prestations et services Immio (à venir).
      </Text>
    </View>

    <Card style={styles.card}>
      <Text variant="body">
        Vous pourrez bientôt consulter ici toutes vos prestations, rapports
        d’analyse, et documents associés.
      </Text>
    </Card>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  card: {
    gap: spacing.sm,
  },
});

export default ServicesRecapScreen;
