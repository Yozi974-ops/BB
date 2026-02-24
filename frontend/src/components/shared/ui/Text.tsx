import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { colors, typography } from "@/src/theme";

type Variant = "h1" | "h2" | "h3" | "body" | "small";

export interface TextProps extends RNTextProps {
  variant?: Variant;
  weight?: "regular" | "medium" | "semibold" | "bold";
  color?: string;
}

const sizeForVariant: Record<Variant, number> = {
  h1: typography.size.h1,
  h2: typography.size.h2,
  h3: typography.size.h3,
  body: typography.size.body,
  small: typography.size.small,
};

type FontWeightType = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "normal" | "bold";

const fontWeightMap: Record<NonNullable<TextProps["weight"]>, FontWeightType> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  weight = "regular",
  style,
  color: colorOverride,
  children,
  ...rest
}) => {
  const fontSize = sizeForVariant[variant];
  const isHeading = variant.startsWith("h");
  const lineHeight = fontSize * (isHeading ? typography.lineHeight.heading : typography.lineHeight.body);
  const fontWeight = fontWeightMap[weight] ?? "400";
  const color = colorOverride ?? (isHeading ? colors.text.heading : colors.text.body);

  return (
    <RNText
      accessibilityRole={isHeading ? "header" : undefined}
      {...rest}
      style={[
        styles.base,
        { fontSize, lineHeight, color, fontWeight },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.text.body,
  },
});

export default Text;
