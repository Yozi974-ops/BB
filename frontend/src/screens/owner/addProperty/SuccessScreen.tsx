import React from "react";
import { ScreenContainer } from "@/src/components/shared/layout/ScreenContainer";
import { Card } from "@/src/components/shared/ui/Card";
import { Text } from "@/src/components/shared/ui/Text";
import { Button } from "@/src/components/shared/ui/Button";
import { colors, spacing } from "@/src/theme";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

export const SuccessScreen: React.FC = () => {
  return (
    <ScreenContainer scrollable={false}>
      <Card style={styles.card}>
        <Text variant="h1" weight="bold">
          Bien ajouté avec succès ✅
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Votre bien est maintenant enregistré. Continuez à enrichir ses informations ou suivez sa performance depuis l’accueil.
        </Text>
        <Button label="Retour à l’accueil" onPress={() => router.replace("/")} />
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});

export default SuccessScreen;
