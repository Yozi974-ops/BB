import React from "react";
import { Pressable, StyleSheet, View, ViewStyle, Text } from "react-native";
import { colors, radii, spacing, typography } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { Ionicons } from "@expo/vector-icons";

interface SelectableCardProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  icon,
  selected,
  onPress,
  style,
  description,
  iconName,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {/* Top accent bar when selected */}
      {selected && <View style={styles.accentBar} />}

      <View style={styles.content}>
        {/* Icon */}
        {icon ? (
          <Text style={styles.emoji}>{icon}</Text>
        ) : iconName ? (
          <View style={[styles.iconBg, selected && styles.iconBgSelected]}>
            <Ionicons name={iconName} size={22} color={selected ? "#fff" : PALETTE.dim} />
          </View>
        ) : null}

        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>

      {/* Selected checkmark */}
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: PALETTE.border,
    backgroundColor: PALETTE.card,
    padding: spacing.md,
    minHeight: 110,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: spacing.xs,
    position: "relative",
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: PALETTE.green,
    backgroundColor: PALETTE.greenDim,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: PALETTE.green,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  content: { gap: spacing.xs },
  emoji: { fontSize: 30, marginBottom: 2 },
  iconBg: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: PALETTE.cardElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  iconBgSelected: { backgroundColor: PALETTE.green },
  label: {
    fontSize: typography.size.body,
    fontWeight: "700",
    color: colors.text.body,
  },
  labelSelected: { color: colors.text.heading },
  description: {
    fontSize: typography.size.xs,
    color: PALETTE.dim,
    lineHeight: 16,
  },
  checkmark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PALETTE.green,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SelectableCard;
