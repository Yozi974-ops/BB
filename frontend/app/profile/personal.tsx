import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { spacing, colors } from "@/src/theme";
import BackButton from "@/src/components/navigation/BackButton";

const PersonalInfoScreen: React.FC = () => {
  // TODO: brancher avec /api/auth/me quand dispo
  return (
    <ScreenContainer showProfileButton={false}>
      <BackButton />
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Informations personnelles
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Consultez et mettez à jour vos informations de compte.
        </Text>
      </View>

      <Card style={styles.card}>
        <Text variant="small" color={colors.neutral[500]}>
          Nom complet
        </Text>
        <Text variant="body" weight="medium">
          John Doe
        </Text>

        <Text variant="small" color={colors.neutral[500]}>
          Email
        </Text>
        <Text variant="body" weight="medium">
          john.doe@email.com
        </Text>

        <Text variant="small" color={colors.neutral[500]}>
          Téléphone
        </Text>
        <Text variant="body" weight="medium">
          —
        </Text>

        <Button
          label="Modifier mes informations"
          variant="ghost"
          onPress={() => {}}
        />
        <Button
          label="Modifier mon mot de passe"
          variant="ghost"
          onPress={() => {}}
        />
      </Card>
    </ScreenContainer>
  );
};

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

export default PersonalInfoScreen;
