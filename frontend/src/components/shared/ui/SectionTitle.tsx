import React from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";
import { colors, typography, spacing } from "@/src/theme";

interface SectionTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, style }) => {
  return (
    <Text style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: typography.size.h3,
    fontWeight: "800", // Extra bold
    color: colors.text.heading,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    letterSpacing: -0.5, // Tighter tracking for headlines
  },
});

export default SectionTitle;
