import React from "react";
import { View, Text } from "react-native";
import { styles, PALETTE } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Property } from "@/src/services/propertyService";

interface PropertiesTableProps {
  properties: Property[];
}

export default function PropertiesTable({ properties }: PropertiesTableProps) {
  const staticRows = [
    { name: "Studio Bastille", yield: "4,8 %", diff: "+320 €", positive: true },
    { name: "T2 Lille", yield: "5,4 %", diff: "-120 €", positive: false },
  ];

  const rows = properties.length > 0
    ? properties.map((p) => ({
      name: p.name ?? p.title ?? "Bien",
      yield: "—",
      diff: "—",
      positive: true,
    }))
    : staticRows;

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Bien</Text>
        <Text style={styles.tableHeaderCell}>Rendement</Text>
        <Text style={styles.tableHeaderCell}>Diff. YTD</Text>
      </View>
      {/* Rows */}
      {rows.map((p, i) => (
        <View key={i} style={styles.row}>
          <Text style={[styles.cell, { textAlign: "left", color: PALETTE.body }]}>{p.name}</Text>
          <Text style={[styles.cell, { color: PALETTE.dim }]}>{p.yield}</Text>
          <Text
            style={[
              styles.cell,
              { color: p.positive ? PALETTE.success : PALETTE.danger, fontWeight: "700" },
            ]}
          >
            {p.diff}
          </Text>
        </View>
      ))}
    </View>
  );
}
