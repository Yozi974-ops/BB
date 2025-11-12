import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { spacing, colors } from "@/src/theme";
import BackButton from "@/src/components/navigation/BackButton";

const AboutScreen: React.FC = () => (
  <ScreenContainer showProfileButton={false}>
    <BackButton />
    <View style={styles.header}>
      <Text variant="h1" weight="bold">
        À propos d’Immio
      </Text>
    </View>
    <Card style={styles.card}>
      <Text variant="body" color={colors.neutral[600]}>
        Immio vous aide à centraliser, analyser et optimiser la gestion de vos biens immobiliers.
      </Text>
      <Text variant="body" color={colors.neutral[600]}>
        Vision : rendre l’investissement immobilier plus simple, plus transparent, et plus efficace.
      </Text>
    </Card>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
});

export default AboutScreen;
