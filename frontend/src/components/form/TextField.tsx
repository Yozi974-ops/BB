import React from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { colors, radii, spacing, typography } from "@/src/theme";
import { Text } from "../ui/Text";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextField: React.FC<Props> = ({ label, error, helperText, style, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text variant="small" weight="medium" color={colors.neutral[700]}>
        {label}
      </Text>
      <TextInput
        {...rest}
        style={[styles.input, style, error ? styles.inputError : null]}
        placeholderTextColor={colors.neutral[400]}
      />
      {error ? (
        <Text variant="small" color={colors.semantic.danger}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="small" color={colors.neutral[500]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.body,
    color: colors.text.onLight,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.semantic.danger,
  },
});

export default TextField;
