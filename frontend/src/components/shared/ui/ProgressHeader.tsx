import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

type ProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
  label?: string;
  title?: string;
};

const STEP_LABELS = [
  "Type",
  "Localisation",
  "Caractéristiques",
  "Technique",
  "Finances",
  "Documents",
  "Récapitulatif",
];

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  label,
  title,
}) => {
  const safeTotal = totalSteps > 0 ? totalSteps : 1;
  const clampedStep = Math.min(Math.max(currentStep, 1), safeTotal);
  const progressPercent = (clampedStep / safeTotal) * 100;
  const stepLabel = title ?? label ?? STEP_LABELS[clampedStep - 1] ?? "";

  return (
    <View style={styles.container}>
      {/* Top row : back + step count */}
      <View style={styles.topRow}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={PALETTE.ink} />
        </Pressable>
        <View style={styles.stepPills}>
          {Array.from({ length: safeTotal }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepPill,
                i < clampedStep ? styles.stepPillDone : styles.stepPillPending,
                i === clampedStep - 1 && styles.stepPillActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepCount}>{clampedStep}/{safeTotal}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{stepLabel}</Text>

      {/* Progress bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${progressPercent}%` as any }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: PALETTE.bg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PALETTE.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  stepPills: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  stepPill: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepPillDone: {
    backgroundColor: PALETTE.green,
  },
  stepPillPending: {
    backgroundColor: PALETTE.border,
  },
  stepPillActive: {
    backgroundColor: PALETTE.green,
    opacity: 0.7,
  },
  stepCount: {
    color: PALETTE.dim,
    fontSize: typography.size.xs,
    fontWeight: "600",
    minWidth: 28,
    textAlign: "right",
  },
  title: {
    fontSize: typography.size.h2,
    fontWeight: "700",
    color: colors.text.heading,
    letterSpacing: -0.3,
  },
  barBg: {
    height: 3,
    borderRadius: 2,
    backgroundColor: PALETTE.card,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: PALETTE.green,
  },
});

export default ProgressHeader;
