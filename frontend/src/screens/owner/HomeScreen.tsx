import React from "react";
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors, spacing, typography } from "@/src/theme";
import { fetchProperties, Property } from "@/src/services/propertyService";
import { authService, User } from "@/src/services/auth";

import HomeHeader from "@/src/components/owner/home/HomeHeader";
import HeroCard from "@/src/components/owner/home/HeroCard";
import Chart from "@/src/components/owner/home/Chart";
import QuickAccessGrid from "@/src/components/owner/home/QuickAccessGrid";
import PropertiesTable from "@/src/components/owner/home/PropertiesTable";
import { PALETTE } from "@/src/components/owner/home/styles";

export default function HomeScreen() {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [user, setUser] = React.useState<User | null>(null);
  const [need, setNeed] = React.useState<string>("");
  const [proQuery, setProQuery] = React.useState<string>("");

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [props, me] = await Promise.all([
        fetchProperties().catch(() => []),
        authService.getMe().catch(() => null),
      ]);
      setProperties(props);
      setUser(me);
    } catch (error) {
      console.log("Error loading home data", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <HomeHeader user={user} />

        {/* 2. Patrimoine Net */}
        <HeroCard
          patrimoine={1240000}
          trend={2.4}
          nbProperties={properties.length}
        />

        {/* 3. Cash Flow Chart */}
        <Text style={styles.sectionTitle}>Cash Flow</Text>
        <Chart />

        {/* 4. Accès rapide — Bento Grid */}
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <QuickAccessGrid
          need={need}
          setNeed={setNeed}
          proQuery={proQuery}
          setProQuery={setProQuery}
        />

        {/* 5. Biens */}
        {(properties.length > 0) && (
          <>
            <Text style={styles.sectionTitle}>Mes biens</Text>
            <PropertiesTable properties={properties} />
          </>
        )}

        {/* 6. Feed Actualités */}
        <Text style={styles.sectionTitle}>Actualités</Text>
        <View style={styles.feedCard}>
          <FeedItem
            icon="mail-outline"
            iconBg={PALETTE.purpleDim}
            iconColor={PALETTE.purple}
            title="Nouveau message de Jean (Locataire)"
            time="Il y a 10 min"
          />
          <View style={styles.feedDivider} />
          <FeedItem
            icon="checkmark-circle-outline"
            iconBg={colors.semantic.successDim}
            iconColor={colors.semantic.success}
            title="Loyer reçu — Studio Bastille"
            time="Hier"
          />
          <View style={styles.feedDivider} />
          <FeedItem
            icon="construct-outline"
            iconBg={PALETTE.greenDim}
            iconColor={PALETTE.green}
            title="Devis #124 accepté — Plomberie"
            time="Il y a 2 jours"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Inline Feed Item ── */
function FeedItem({
  icon,
  iconBg,
  iconColor,
  title,
  time,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
}) {
  return (
    <View style={styles.feedItem}>
      <View style={[styles.feedIconBg, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.feedContent}>
        <Text style={styles.feedTitle}>{title}</Text>
        <Text style={styles.feedTime}>{time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={PALETTE.dim} />
    </View>
  );
}

/* ── Local Styles ── */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 100,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.h3,
    fontWeight: "700",
    color: colors.text.heading,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },

  // Feed
  feedCard: {
    backgroundColor: PALETTE.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PALETTE.border,
    overflow: "hidden",
  },
  feedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  feedDivider: {
    height: 1,
    backgroundColor: PALETTE.border,
    marginHorizontal: spacing.md,
  },
  feedIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  feedContent: { flex: 1 },
  feedTitle: {
    fontWeight: "600",
    color: colors.text.body,
    fontSize: typography.size.small,
    marginBottom: 2,
  },
  feedTime: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
  },
});