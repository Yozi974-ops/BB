import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, PALETTE } from "./styles";
import { router } from "expo-router";

interface HeroCardProps {
  patrimoine?: number;
  trend?: number;
  nbProperties?: number;
}

export default function HeroCard({ patrimoine = 1240000, trend = 2.4, nbProperties = 0 }: HeroCardProps) {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(patrimoine);

  return (
    <View style={styles.heroCard}>
      {/* Patrimoine — non cliquable */}
      <View>
        <Text style={styles.heroLabel}>Patrimoine Net</Text>
        <Text style={styles.heroValue}>{formatted}</Text>
      </View>

      {/* KPIs row — cliquables */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

        {/* Tendance → Cash Flow */}
        <Pressable
          style={styles.trendBadge}
          onPress={() => router.push("/(owner)/cashflow" as any)}
          accessibilityLabel="Voir le cash flow"
        >
          <Ionicons name="trending-up" size={12} color={PALETTE.success} />
          <Text style={styles.trendText}>+{trend}% ce mois</Text>
          <Ionicons name="chevron-forward" size={10} color={PALETTE.success} />
        </Pressable>

        {/* Biens → Liste des biens */}
        {nbProperties > 0 && (
          <Pressable
            style={[styles.trendBadge, { backgroundColor: PALETTE.greenDim }]}
            onPress={() => router.push("/(owner)/properties" as any)}
            accessibilityLabel="Voir mes biens"
          >
            <Ionicons name="home" size={12} color={PALETTE.green} />
            <Text style={[styles.trendText, { color: PALETTE.green }]}>
              {nbProperties} bien{nbProperties > 1 ? "s" : ""}
            </Text>
            <Ionicons name="chevron-forward" size={10} color={PALETTE.green} />
          </Pressable>
        )}

        {/* Biens simulés si pas encore chargés */}
        {nbProperties === 0 && (
          <Pressable
            style={[styles.trendBadge, { backgroundColor: PALETTE.greenDim }]}
            onPress={() => router.push("/(owner)/properties" as any)}
            accessibilityLabel="Voir mes biens"
          >
            <Ionicons name="home" size={12} color={PALETTE.green} />
            <Text style={[styles.trendText, { color: PALETTE.green }]}>3 biens</Text>
            <Ionicons name="chevron-forward" size={10} color={PALETTE.green} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
