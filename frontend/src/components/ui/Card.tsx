import React, { PropsWithChildren } from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { colors, radii, shadows, spacing } from "@/src/theme";

interface CardProps extends ViewProps {
  elevated?: boolean;
  backgroundColor?: string;
}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  children,
  style,
  elevated = true,
  backgroundColor = colors.surface,
  ...rest
}) => {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        { backgroundColor },
        elevated && shadows.card,
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
    padding: spacing.lg,
  },
});

export default Card;
