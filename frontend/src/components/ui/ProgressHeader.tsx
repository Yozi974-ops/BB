import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radii, spacing } from "@/src/theme";
import { Text } from "./Text";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  label: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ currentStep, totalSteps, label }) => {
  const progress = Math.min(1, currentStep / totalSteps);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text variant="h3" weight="semibold">
          Étape {currentStep} / {totalSteps}
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          {label}
        </Text>
      </View>
      <View style={styles.progressBackground} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 1, now: progress }}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  labelRow: {
    gap: spacing.xs,
  },
  progressBackground: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.neutral[200],
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
});

export default ProgressHeader;
