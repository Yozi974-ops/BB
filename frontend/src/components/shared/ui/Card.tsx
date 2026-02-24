import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, radii, spacing, shadows } from "@/src/theme";

type CardVariant = "default" | "elevated" | "flat" | "outline" | "accent";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padding?: number;
  accentColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  style,
  padding = spacing.md,
  accentColor,
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        accentColor && { borderLeftColor: accentColor, borderLeftWidth: 3 },
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  default: {
    ...shadows.card,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadows.floating,
  },
  flat: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    backgroundColor: "transparent",
  },
  accent: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accents.greenDim,
    ...shadows.card,
  },
});

export default Card;
