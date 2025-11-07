import React from "react";
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { colors, radii, shadows, spacing, typography } from "@/src/theme";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
  accessibilityHint?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled,
  variant = "primary",
  style,
  accessibilityHint,
  loading,
}) => {
  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.secondary
        : "transparent";
  const textColor = variant === "ghost" ? colors.primary : colors.text.onDark;
  const borderColor = variant === "ghost" ? colors.primary : "transparent";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, borderColor, opacity: disabled ? 0.4 : 1 },
        variant !== "ghost" && shadows.card,
        variant === "ghost" && styles.ghost,
        pressed && (variant === "ghost" ? styles.ghostPressed : styles.pressed),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text variant="body" weight="medium" color={textColor} style={styles.label}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  ghostPressed: {
    backgroundColor: colors.overlay.lightHover,
  },
  label: {
    fontFamily: typography.fonts.bodyMedium,
  },
});

export default Button;
