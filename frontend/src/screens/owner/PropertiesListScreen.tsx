import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { fetchProperties, Property } from "@/src/services/propertyService";
import { NavHeader } from "@/src/components/shared/ui/NavHeader";

// ─── Mock KPI enrichment ─────────────────────────────────────────────────────
const MOCK_KPI: Record<string, {
    grossYield: number; netYield: number;
    monthlyRent: number; monthlyCharges: number;
    occupancy: number; status: "Loué" | "Disponible" | "Travaux";
    statusColor: string; trend: number;
}> = {
    default1: { grossYield: 6.2, netYield: 4.8, monthlyRent: 1200, monthlyCharges: 320, occupancy: 100, status: "Loué", statusColor: colors.semantic.success, trend: 2.4 },
    default2: { grossYield: 7.1, netYield: 5.4, monthlyRent: 950, monthlyCharges: 210, occupancy: 100, status: "Loué", statusColor: colors.semantic.success, trend: 1.1 },
    default3: { grossYield: 4.9, netYield: 3.2, monthlyRent: 0, monthlyCharges: 180, occupancy: 0, status: "Disponible", statusColor: colors.secondary, trend: -0.5 },
};

const MOCK_PROPERTIES: Property[] = [
    { id: 1, title: "Studio Bastille", address: "12 rue de la Roquette, Paris 11e", type: "apartment" },
    { id: 2, title: "T2 Lille Centre", address: "8 rue Inkermann, Lille", type: "apartment" },
    { id: 3, title: "Maison Vincennes", address: "3 rue de Montreuil, Vincennes", type: "house" },
];

const TYPE_ICON: Record<string, string> = {
    apartment: "business",
    house: "home",
    land: "leaf",
    commercial: "storefront",
};

export default function PropertiesListScreen() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await fetchProperties().catch(() => []);
            setProperties(data.length > 0 ? data : MOCK_PROPERTIES);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    const kpis = properties.reduce((acc, p, i) => {
        const k = Object.values(MOCK_KPI)[i % 3];
        return {
            totalRent: acc.totalRent + (k?.monthlyRent ?? 0),
            totalCharges: acc.totalCharges + (k?.monthlyCharges ?? 0),
            count: acc.count + 1,
        };
    }, { totalRent: 0, totalCharges: 0, count: 0 });

    const avgYield = 5.1;

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar style="light" />

            {/* ── Header ── */}
            <NavHeader
                title="Mes Biens"
                subtitle="Portefeuille"
                rightAction={{ icon: "add", onPress: () => router.push("/add-property" as any) }}
            />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); load(true); }}
                        tintColor={PALETTE.green}
                    />
                }
            >
                {/* ── Global KPI Strip ── */}
                <View style={styles.kpiStrip}>
                    <KpiCard
                        icon="cash" label="Revenus / mois"
                        value={`${kpis.totalRent.toLocaleString("fr-FR")} €`}
                        color={colors.semantic.success}
                    />
                    <KpiCard
                        icon="trending-up" label="Rendement moy."
                        value={`${avgYield}%`}
                        color={PALETTE.green}
                    />
                    <KpiCard
                        icon="home" label="Biens"
                        value={kpis.count.toString()}
                        color={PALETTE.purple}
                    />
                </View>

                {/* ── Section label ── */}
                <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Détail des biens</Text>
                    <Pressable>
                        <Text style={styles.sectionLink}>Filtrer</Text>
                    </Pressable>
                </View>

                {/* ── Property Cards ── */}
                {loading ? (
                    <ActivityIndicator color={PALETTE.green} style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.list}>
                        {properties.map((p, i) => {
                            const kpi = Object.values(MOCK_KPI)[i % 3];
                            return (
                                <PropertyCard
                                    key={p.id}
                                    property={p}
                                    kpi={kpi}
                                    onPress={() =>
                                        router.push({ pathname: "/(owner)/property/[id]", params: { id: String(p.id) } } as any)
                                    }
                                />
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    return (
        <View style={[styles.kpiCard, { borderColor: color + "33" }]}>
            <View style={[styles.kpiIconBg, { backgroundColor: color + "22" }]}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text style={styles.kpiValue}>{value}</Text>
            <Text style={styles.kpiLabel}>{label}</Text>
        </View>
    );
}

// ─── PropertyCard ─────────────────────────────────────────────────────────────
function PropertyCard({
    property, kpi, onPress,
}: {
    property: Property;
    kpi: typeof MOCK_KPI[string];
    onPress: () => void;
}) {
    const name = property.title ?? property.name ?? "Bien";
    const icon = TYPE_ICON[property.type ?? "apartment"] ?? "home";
    const cashflow = kpi.monthlyRent - kpi.monthlyCharges;

    return (
        <Pressable style={styles.propCard} onPress={onPress}>
            {/* Top row */}
            <View style={styles.propTop}>
                <View style={[styles.propIconBg, { backgroundColor: PALETTE.greenDim }]}>
                    <Ionicons name={icon as any} size={20} color={PALETTE.green} />
                </View>
                <View style={styles.propInfo}>
                    <View style={styles.propNameRow}>
                        <Text style={styles.propName}>{name}</Text>
                        <View style={[styles.statusChip, { backgroundColor: kpi.statusColor + "22" }]}>
                            <View style={[styles.statusDot, { backgroundColor: kpi.statusColor }]} />
                            <Text style={[styles.statusText, { color: kpi.statusColor }]}>{kpi.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.propAddress} numberOfLines={1}>{property.address}</Text>
                </View>
            </View>

            {/* KPI row */}
            <View style={styles.propKpiRow}>
                <KpiPill label="Brut" value={`${kpi.grossYield}%`} color={PALETTE.green} />
                <KpiPill label="Net" value={`${kpi.netYield}%`} color={colors.semantic.success} />
                <KpiPill label="Cash-flow" value={`+${cashflow} €`} positive={cashflow >= 0} />
                <KpiPill label="Occupation" value={`${kpi.occupancy}%`} color={PALETTE.purple} />
            </View>

            {/* Bottom row */}
            <View style={styles.propBottom}>
                <Text style={styles.propRent}>{kpi.monthlyRent > 0 ? `${kpi.monthlyRent} €/mois` : "Non loué"}</Text>
                <View style={styles.propAction}>
                    <Text style={styles.propActionText}>Voir le détail</Text>
                    <Ionicons name="arrow-forward" size={14} color={PALETTE.green} />
                </View>
            </View>
        </Pressable>
    );
}

function KpiPill({ label, value, color, positive }: { label: string; value: string; color?: string; positive?: boolean }) {
    const c = color ?? (positive !== false ? colors.semantic.success : colors.semantic.danger);
    return (
        <View style={styles.kpiPill}>
            <Text style={styles.kpiPillLabel}>{label}</Text>
            <Text style={[styles.kpiPillValue, { color: c }]}>{value}</Text>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.bg },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.screenPadding,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
    },
    headerSuper: { fontSize: typography.size.xs, color: PALETTE.green, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
    headerTitle: { fontSize: typography.size.h1, fontWeight: "700", color: colors.text.heading, letterSpacing: -0.5 },
    addBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: PALETTE.green,
        alignItems: "center", justifyContent: "center",
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
    },

    scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 100, gap: spacing.md },

    // Global KPI strip
    kpiStrip: { flexDirection: "row", gap: spacing.sm },
    kpiCard: {
        flex: 1, backgroundColor: PALETTE.card, borderRadius: radii.lg,
        padding: spacing.sm, borderWidth: 1, alignItems: "center", gap: 4,
    },
    kpiIconBg: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    kpiValue: { fontSize: typography.size.body, fontWeight: "700", color: colors.text.heading },
    kpiLabel: { fontSize: typography.size.xs, color: PALETTE.dim, textAlign: "center" },

    // Section
    sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sectionTitle: { fontSize: typography.size.h3, fontWeight: "700", color: colors.text.heading },
    sectionLink: { fontSize: typography.size.small, color: PALETTE.green, fontWeight: "600" },

    list: { gap: 12 },

    // Property Card
    propCard: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl,
        padding: spacing.md, borderWidth: 1, borderColor: PALETTE.border, gap: spacing.sm,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
    },
    propTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    propIconBg: { width: 44, height: 44, borderRadius: radii.md, alignItems: "center", justifyContent: "center" },
    propInfo: { flex: 1 },
    propNameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 },
    propName: { fontSize: typography.size.body, fontWeight: "700", color: colors.text.heading, flex: 1 },
    propAddress: { fontSize: typography.size.xs, color: PALETTE.dim, marginTop: 2 },

    statusChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 3, paddingHorizontal: 8, borderRadius: radii.pill },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: typography.size.xs, fontWeight: "700" },

    // KPI row
    propKpiRow: { flexDirection: "row", gap: 6 },
    kpiPill: {
        flex: 1, backgroundColor: PALETTE.cardElevated, borderRadius: radii.md,
        padding: 6, alignItems: "center", borderWidth: 1, borderColor: PALETTE.border,
    },
    kpiPillLabel: { fontSize: 9, color: PALETTE.dim, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.3 },
    kpiPillValue: { fontSize: typography.size.xs, fontWeight: "700", marginTop: 2 },

    propBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    propRent: { fontSize: typography.size.small, color: colors.text.body, fontWeight: "600" },
    propAction: { flexDirection: "row", alignItems: "center", gap: 4 },
    propActionText: { fontSize: typography.size.xs, color: PALETTE.green, fontWeight: "700" },
});
