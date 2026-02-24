import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PALETTE } from "@/src/components/owner/home/styles";

export const SmallTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.smallTag}>
    <Text style={styles.smallTagText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  smallTag: {
    backgroundColor: "#fff",
    borderColor: PALETTE.line,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
  },
  smallTagText: { color: PALETTE.ink },
});

export default SmallTag;
