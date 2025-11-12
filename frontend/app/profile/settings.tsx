import React, { useState } from "react";
import { StyleSheet, View, Switch } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { spacing, colors } from "@/src/theme";
import BackButton from "@/src/components/navigation/BackButton";

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScreenContainer showProfileButton={false}>
      <BackButton />
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Paramètres
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Adaptez Immio à vos préférences.
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="body">Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>
        <View style={styles.row}>
          <Text variant="body">Mode sombre</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
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
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default SettingsScreen;
