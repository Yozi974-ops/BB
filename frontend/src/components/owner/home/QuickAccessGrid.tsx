import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

// ─── Chaque tuile décrit UNE action claire ─────────────────────────────────
const TILES = [
  {
    id: "biens",
    icon: "home" as const,
    iconColor: PALETTE.purple,
    iconBg: PALETTE.purpleDim,
    label: "Mes Biens",
    description: "Voir & gérer\nmes propriétés",
    badge: "3 biens",
    route: "/(owner)/properties",
    accentColor: colors.primary,
  },
  {
    id: "echeancier",
    icon: "calendar" as const,
    iconColor: "#58A6FF",
    iconBg: "rgba(88,166,255,0.15)",
    label: "Échéances",
    description: "Loyers, crédits\n& paiements",
    badge: "3 ce mois",
    route: "/(owner)/echeancier",
    accentColor: "#58A6FF",
  },
  {
    id: "pro",
    icon: "hammer" as const,
    iconColor: PALETTE.purple,
    iconBg: PALETTE.purpleDim,
    label: "Trouver un Pro",
    description: "Plombier, électricien,\nartisan certifié",
    badge: null,
    route: "/(owner)/trouver-un-pro",
    accentColor: "#9471C1",
  },
  {
    id: "video",
    icon: "videocam" as const,
    iconColor: "#F85149",
    iconBg: "rgba(248,81,73,0.15)",
    label: "Assistance Vidéo",
    description: "Visio avec\nun expert",
    badge: "1 confirmée",
    route: "/(owner)/assistance-video",
    accentColor: "#F85149",
  },
  {
    id: "map",
    icon: "map" as const,
    iconColor: "#F59E0B",
    iconBg: "rgba(245,158,11,0.15)",
    label: "Carte",
    description: "Localiser\nmes biens",
    badge: null,
    route: "/(owner)/map",
    accentColor: "#F59E0B",
  },
];

export default function QuickAccessGrid() {
  return (
    <View style={s.grid}>
      {TILES.map((tile) => (
        <Pressable
          key={tile.id}
          style={({ pressed }) => [s.tile, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
          onPress={() => router.push(tile.route as any)}
          accessibilityLabel={tile.label}
          accessibilityHint={tile.description.replace("\n", " ")}
        >
          {/* Accent top border */}
          <View style={[s.accentBar, { backgroundColor: tile.accentColor }]} />

          {/* Icon */}
          <View style={[s.iconWrap, { backgroundColor: tile.iconBg }]}>
            <Ionicons name={tile.icon} size={30} color={tile.iconColor} />
          </View>

          {/* Label */}
          <Text style={s.label}>{tile.label}</Text>

          {/* Description */}
          <Text style={s.description}>{tile.description}</Text>

          {/* Badge */}
          {tile.badge && (
            <View style={[s.badge, { backgroundColor: tile.accentColor + "28" }]}>
              <Text style={[s.badgeTxt, { color: tile.accentColor }]}>{tile.badge}</Text>
            </View>
          )}

          {/* Arrow */}
          <View style={s.arrowWrap}>
            <Ionicons name="arrow-forward" size={14} color={tile.iconColor} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    width: "47.5%",
    backgroundColor: PALETTE.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: PALETTE.border,
    padding: spacing.md,
    paddingTop: spacing.md + 4,
    overflow: "hidden",
    gap: 6,
    minHeight: 160,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: typography.size.body,
    fontWeight: "700",
    color: "#F0F6FC",
    letterSpacing: -0.2,
  },
  description: {
    fontSize: typography.size.xs,
    color: PALETTE.dim,
    lineHeight: 16,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    marginTop: 2,
  },
  badgeTxt: {
    fontSize: 10,
    fontWeight: "700",
  },
  arrowWrap: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
});
