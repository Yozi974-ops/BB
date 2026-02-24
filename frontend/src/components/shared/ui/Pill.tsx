import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PALETTE } from "@/src/components/owner/home/styles";

export const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#fff",
    borderColor: PALETTE.line,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 6,
  },
  pillText: { color: PALETTE.ink, fontWeight: "700" },
});

export default Pill;
