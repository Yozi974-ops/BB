import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { colors, typography } from "@/src/theme";

type Variant = "h1" | "h2" | "h3" | "body" | "small";

export interface TextProps extends RNTextProps {
  variant?: Variant;
  weight?: "regular" | "medium" | "semibold" | "bold";
  color?: string;
}

const fontForVariant: Record<Variant, { size: number; fontFamily: keyof typeof typography.fonts }> = {
  h1: { size: typography.size.h1, fontFamily: "headingBold" },
  h2: { size: typography.size.h2, fontFamily: "heading" },
  h3: { size: typography.size.h3, fontFamily: "heading" },
  body: { size: typography.size.body, fontFamily: "body" },
  small: { size: typography.size.small, fontFamily: "body" },
};

const weightMap: Record<NonNullable<TextProps["weight"]>, string> = {
  regular: typography.fonts.body,
  medium: typography.fonts.bodyMedium,
  semibold: typography.fonts.heading,
  bold: typography.fonts.headingBold,
};

type FontWeightValue = RNTextProps["style"] extends infer S
  ? S extends { fontWeight?: infer W }
    ? W
    : string
  : string;

const fontWeightMap: Record<NonNullable<TextProps["weight"]>, FontWeightValue> = {
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
  const variantConfig = fontForVariant[variant];
  const baseColor = colorOverride ?? colors.text.onLight;
  const defaultFamily = typography.fonts[variantConfig.fontFamily];
  const fontFamily = weight === "regular" ? defaultFamily : weightMap[weight] ?? defaultFamily;
  const fontWeight = fontWeightMap[weight] ?? "400";

  return (
    <RNText
      accessibilityRole={variant.startsWith("h") ? "header" : undefined}
      {...rest}
      style={[
        styles.base,
        {
          fontSize: variantConfig.size,
          lineHeight: variantConfig.size * (variant.startsWith("h") ? typography.lineHeight.heading : typography.lineHeight.body),
          color: baseColor,
          fontFamily,
          fontWeight,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.text.onLight,
  },
});

export default Text;
