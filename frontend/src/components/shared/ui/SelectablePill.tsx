import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { PALETTE } from "@/src/components/owner/home/styles";

type Props = {
  children: React.ReactNode;
  selected?: boolean;
  onPress: () => void;
};

export const SelectablePill: React.FC<Props> = ({ children, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.selPill, selected && styles.selPillSelected]}
    activeOpacity={0.85}
  >
    <Text style={[styles.selPillText, selected && { color: "#fff" }]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  selPill: {
    borderWidth: 1,
    borderColor: PALETTE.green,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 6,
    backgroundColor: "#fff",
  },
  selPillSelected: { backgroundColor: PALETTE.dark, borderColor: PALETTE.dark },
  selPillText: { color: PALETTE.ink, fontWeight: "700" },
});

export default SelectablePill;
