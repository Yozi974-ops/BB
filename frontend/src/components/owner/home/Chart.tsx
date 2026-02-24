import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles, PALETTE } from "./styles";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const chartData = [
  { m: "Jan", in: 2150, out: 1070 },
  { m: "Fév", in: 2150, out: 1040 },
  { m: "Mar", in: 2150, out: 1060 },
  { m: "Avr", in: 2150, out: 1050 },
  { m: "Mai", in: 2150, out: 1040 },
  { m: "Jun", in: 2150, out: 2840 },
  { m: "Jul", in: 2150, out: 1070 },
  { m: "Aoû", in: 2150, out: 1050 },
  { m: "Sep", in: 2150, out: 1050 },
  { m: "Oct", in: 2150, out: 3160 },
  { m: "Nov", in: 2150, out: 1050 },
  { m: "Déc", in: 2150, out: 1090 },
];

export default function Chart() {
  const max = Math.max(...chartData.map((d) => Math.max(d.in, d.out)));
  const MAX_HEIGHT = 120;

  const totalIn = chartData.reduce((s, d) => s + d.in, 0);
  const totalOut = chartData.reduce((s, d) => s + d.out, 0);
  const balance = totalIn - totalOut;

  return (
    <Pressable
      style={styles.chartCard}
      onPress={() => router.push("/(owner)/cashflow" as any)}
      accessibilityLabel="Voir le détail du cash flow"
    >
      {/* Header */}
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Cash Flow — 2025</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: PALETTE.green }]} />
              <Text style={styles.legendText}>Entrées</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: PALETTE.danger }]} />
              <Text style={styles.legendText}>Sorties</Text>
            </View>
          </View>
          {/* "Voir plus" indicator */}
          <Ionicons name="arrow-forward-circle" size={18} color={PALETTE.green} />
        </View>
      </View>

      {/* Balance pill */}
      <View style={{
        alignSelf: "flex-start",
        backgroundColor: balance >= 0 ? PALETTE.greenDim : "rgba(248,81,73,0.15)",
        borderRadius: 999,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginBottom: 4,
      }}>
        <Text style={{
          fontSize: 11,
          fontWeight: "700",
          color: balance >= 0 ? PALETTE.green : PALETTE.danger,
        }}>
          Solde net {balance >= 0 ? "+" : ""}{balance.toLocaleString("fr-FR")} €/an
        </Text>
      </View>

      <View style={styles.chartArea}>
        {/* Grid lines */}
        <View style={[styles.grid, { height: MAX_HEIGHT + 4 }]}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>

        {/* Bars */}
        <View style={styles.barsRow}>
          {chartData.map((d, i) => {
            const net = d.in - d.out;
            return (
              <View key={i} style={styles.barCol}>
                <View style={styles.barGroup}>
                  <View
                    style={[
                      styles.barIn,
                      { height: Math.max(4, (d.in / max) * MAX_HEIGHT) },
                    ]}
                  />
                  <View
                    style={[
                      styles.barOut,
                      { height: Math.max(4, (d.out / max) * MAX_HEIGHT) },
                    ]}
                  />
                </View>
                {/* Net indicator dot */}
                <View style={{
                  width: 4, height: 4, borderRadius: 2, marginBottom: 2,
                  backgroundColor: net >= 0 ? PALETTE.green : PALETTE.danger,
                }} />
                <Text style={styles.month}>{d.m}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Tap hint */}
      <Text style={{ fontSize: 10, color: PALETTE.dim, textAlign: "center", marginTop: 4 }}>
        Appuyez pour le détail mensuel →
      </Text>
    </Pressable>
  );
}
