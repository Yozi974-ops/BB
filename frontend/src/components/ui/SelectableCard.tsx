import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radii, spacing } from "@/src/theme";
import { Text } from "./Text";

interface SelectableCardProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  description?: string;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  icon,
  selected,
  onPress,
  style,
  description,
}) => {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [
      styles.card,
      {
        borderColor: selected ? colors.primary : colors.neutral[200],
        backgroundColor: selected ? "#F3F0FA" : colors.surface,
        opacity: pressed ? 0.9 : 1,
      },
      style,
    ]}>
      <View style={styles.content}>
        {icon ? (
          <Text variant="h2" weight="semibold" style={styles.icon}>
            {icon}
          </Text>
        ) : null}
        <Text variant="body" weight="medium">
          {label}
        </Text>
        {description ? (
          <Text variant="small" color={colors.neutral[600]}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 2,
    padding: spacing.md,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  content: {
    gap: spacing.xs,
  },
  icon: {
    fontSize: 32,
  },
});

export default SelectableCard;
