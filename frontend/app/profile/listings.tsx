import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { spacing, colors } from "@/src/theme";
import BackButton from "@/src/components/navigation/BackButton";

const ListingsScreen: React.FC = () => (
  <ScreenContainer showProfileButton={false}>
    <BackButton />
    <View style={styles.header}>
      <Text variant="h1" weight="bold">
        Mes annonces
      </Text>
      <Text variant="body" color={colors.neutral[600]}>
        Bientôt : gérez vos annonces publiées directement depuis Immio.
      </Text>
    </View>
    <Card style={styles.card}>
      <Text variant="body">
        Aucun module d’annonces actif pour le moment.
      </Text>
      <Button label="Créer une annonce" variant="ghost" onPress={() => {}} />
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

export default ListingsScreen;
