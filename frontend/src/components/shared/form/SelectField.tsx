import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View, FlatList } from "react-native";
import { colors, radii, spacing } from "@/src/theme";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

interface SelectFieldProps<T> {
  label: string;
  placeholder?: string;
  value?: T;
  onValueChange?: (value: T) => void;
  options: SelectOption<T>[];
  error?: string;
}

export const SelectField = <T,>({ label, placeholder, value, onValueChange, options, error }: SelectFieldProps<T>) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <Text variant="small" weight="medium" color={colors.neutral[700]}>
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[styles.selector, error ? styles.selectorError : undefined]}
      >
        <Text variant="body" color={selectedOption ? colors.text.onLight : colors.neutral[400]}>
          {selectedOption ? selectedOption.label : placeholder ?? "Sélectionnez"}
        </Text>
      </Pressable>
      {error ? (
        <Text variant="small" color={colors.semantic.danger}>
          {error}
        </Text>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modalContent}>
            <Text variant="h3" weight="semibold">
              {label}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.option,
                    {
                      backgroundColor: pressed ? colors.neutral[100] : colors.surface,
                      borderColor: item.value === value ? colors.primary : "transparent",
                    },
                  ]}
                  onPress={() => {
                    onValueChange?.(item.value);
                    setOpen(false);
                  }}
                >
                  <Text variant="body" weight="medium">
                    {item.label}
                  </Text>
                  {item.description ? (
                    <Text variant="small" color={colors.neutral[500]}>
                      {item.description}
                    </Text>
                  ) : null}
                </Pressable>
              )}
            />
            <Button label="Fermer" variant="ghost" onPress={() => setOpen(false)} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  selector: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  selectorError: {
    borderColor: colors.semantic.danger,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 2,
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
});

export default SelectField;
