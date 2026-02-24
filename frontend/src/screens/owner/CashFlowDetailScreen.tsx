import React, { useState } from "react";
import {
    View, Text, ScrollView, StyleSheet, Pressable, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { NavHeader } from "@/src/components/shared/ui/NavHeader";

// 🟢 Couleur des revenus/entrées dans les graphiques et tables financiers
const CHART_GREEN = colors.semantic.success;

const { width } = Dimensions.get("window");

// ─── Données enrichies (12 mois + détail) ────────────────────────────────────
const DATA_2025 = [
    { m: "Jan", in: 2150, out: 1070, details: { loyers: 2150, credit: 620, charges: 300, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Fév", in: 2150, out: 1040, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 50 } },
    { m: "Mar", in: 2150, out: 1060, details: { loyers: 2150, credit: 620, charges: 290, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Avr", in: 2150, out: 1050, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Mai", in: 2150, out: 1040, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 50 } },
    { m: "Jun", in: 2150, out: 2840, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 1800, taxes: 50 } },
    { m: "Jul", in: 2150, out: 1070, details: { loyers: 2150, credit: 620, charges: 300, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Aoû", in: 2150, out: 1050, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Sep", in: 2150, out: 1050, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Oct", in: 2150, out: 3160, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 2170 } },
    { m: "Nov", in: 2150, out: 1050, details: { loyers: 2150, credit: 620, charges: 280, assurance: 90, travaux: 0, taxes: 60 } },
    { m: "Déc", in: 2150, out: 1090, details: { loyers: 2150, credit: 620, charges: 300, assurance: 90, travaux: 0, taxes: 80 } },
];

const EXPENSE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
    credit: { label: "Remboursement crédit", icon: "card", color: "#58A6FF" },
    charges: { label: "Charges copropriété", icon: "business", color: "#D29922" },
    assurance: { label: "Assurance PNO", icon: "shield-checkmark", color: PALETTE.purple },
    travaux: { label: "Travaux", icon: "construct", color: "#F85149" },
    taxes: { label: "Taxes foncières", icon: "receipt", color: "#F59E0B" },
};

const fmt = (n: number) => n.toLocaleString("fr-FR") + " €";

export default function CashFlowDetailScreen() {
    const [activeMonth, setActiveMonth] = useState<number | null>(null);

    const totalIn = DATA_2025.reduce((s, d) => s + d.in, 0);
    const totalOut = DATA_2025.reduce((s, d) => s + d.out, 0);
    const balance = totalIn - totalOut;
    const maxVal = Math.max(...DATA_2025.flatMap(d => [d.in, d.out]));
    const CHART_H = 130;

    const selected = activeMonth !== null ? DATA_2025[activeMonth] : null;

    return (
        <SafeAreaView style={s.safe} edges={["top"]}>
            <StatusBar style="light" />

            <NavHeader
                title="Cash Flow 2025"
                subtitle="Vue détaillée"
                accentColor="#58A6FF"
            />

            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Bilan annuel KPIs ── */}
                <View style={s.kpiRow}>
                    <KpiTile icon="arrow-down-circle" label="Total entrées" value={fmt(totalIn)} color={CHART_GREEN} />
                    <KpiTile icon="arrow-up-circle" label="Total sorties" value={fmt(totalOut)} color={colors.semantic.danger} />
                    <KpiTile
                        icon="wallet"
                        label="Solde net"
                        value={(balance >= 0 ? "+" : "") + fmt(balance)}
                        color={balance >= 0 ? CHART_GREEN : colors.semantic.danger}
                    />
                </View>

                {/* ── Indicateur mensuel moyen ── */}
                <View style={s.avgRow}>
                    <View style={s.avgItem}>
                        <Text style={s.avgLabel}>Revenu moyen/mois</Text>
                        <Text style={[s.avgValue, { color: CHART_GREEN }]}>{fmt(Math.round(totalIn / 12))}</Text>
                    </View>
                    <View style={s.avgDivider} />
                    <View style={s.avgItem}>
                        <Text style={s.avgLabel}>Charge moyenne/mois</Text>
                        <Text style={[s.avgValue, { color: colors.semantic.danger }]}>{fmt(Math.round(totalOut / 12))}</Text>
                    </View>
                    <View style={s.avgDivider} />
                    <View style={s.avgItem}>
                        <Text style={s.avgLabel}>Cash-flow net/mois</Text>
                        <Text style={[s.avgValue, { color: balance >= 0 ? CHART_GREEN : colors.semantic.danger }]}>
                            {(balance >= 0 ? "+" : "") + fmt(Math.round(balance / 12))}
                        </Text>
                    </View>
                </View>

                {/* ── Histogramme interactif ── */}
                <View style={s.chartCard}>
                    <View style={s.chartHeader}>
                        <Text style={s.chartTitle}>Mois par mois — appuyez pour le détail</Text>
                        <View style={s.legend}>
                            <LegendDot color={CHART_GREEN} label="Entrées" />
                            <LegendDot color={colors.semantic.danger} label="Sorties" />
                        </View>
                    </View>

                    <View style={{ position: "relative" }}>
                        {/* Grid */}
                        {[0.25, 0.5, 0.75, 1].map(f => (
                            <View key={f} style={[s.gridLine, { bottom: 22 + f * CHART_H }]} />
                        ))}

                        {/* Bars row */}
                        <View style={[s.barsRow, { height: CHART_H + 24 }]}>
                            {DATA_2025.map((d, i) => {
                                const revH = Math.max(4, (d.in / maxVal) * CHART_H);
                                const expH = Math.max(4, (d.out / maxVal) * CHART_H);
                                const net = d.in - d.out;
                                const isActive = activeMonth === i;
                                return (
                                    <Pressable
                                        key={i}
                                        style={s.barCol}
                                        onPress={() => setActiveMonth(isActive ? null : i)}
                                    >
                                        <View style={s.barPair}>
                                            <View style={[s.barRev, { height: revH, opacity: isActive ? 1 : 0.75 }]} />
                                            <View style={[s.barExp, { height: expH, opacity: isActive ? 1 : 0.75 }]} />
                                        </View>
                                        {/* Net indicator dot */}
                                        <View style={[s.netDot, { backgroundColor: net >= 0 ? CHART_GREEN : colors.semantic.danger }]} />
                                        <Text style={[s.barLabel, isActive && { color: "#F0F6FC", fontWeight: "700" }]}>
                                            {d.m}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Tooltip mois sélectionné ── */}
                    {selected !== null && activeMonth !== null && (
                        <View style={s.tooltip}>
                            <View style={s.tooltipHeader}>
                                <Text style={s.tooltipMonth}>{selected.m} 2025</Text>
                                <Text style={[
                                    s.tooltipNet,
                                    { color: selected.in - selected.out >= 0 ? CHART_GREEN : colors.semantic.danger }
                                ]}>
                                    Solde : {selected.in - selected.out >= 0 ? "+" : ""}{fmt(selected.in - selected.out)}
                                </Text>
                            </View>
                            <View style={s.tooltipRow}>
                                <View style={s.tooltipBlock}>
                                    <Text style={s.tooltipLabel}>Entrées</Text>
                                    <Text style={[s.tooltipVal, { color: CHART_GREEN }]}>+{fmt(selected.in)}</Text>
                                </View>
                                <View style={s.tooltipSep} />
                                <View style={s.tooltipBlock}>
                                    <Text style={s.tooltipLabel}>Sorties</Text>
                                    <Text style={[s.tooltipVal, { color: colors.semantic.danger }]}>-{fmt(selected.out)}</Text>
                                </View>
                            </View>

                            {/* Détail des dépenses */}
                            <Text style={s.breakdownTitle}>Détail des dépenses</Text>
                            <View style={s.breakdownList}>
                                {Object.entries(selected.details)
                                    .filter(([k]) => k !== "loyers")
                                    .map(([key, val]) => {
                                        const cfg = EXPENSE_LABELS[key];
                                        if (!cfg || val === 0) return null;
                                        return (
                                            <View key={key} style={s.breakdownRow}>
                                                <View style={[s.breakdownIcon, { backgroundColor: cfg.color + "22" }]}>
                                                    <Ionicons name={cfg.icon} size={13} color={cfg.color} />
                                                </View>
                                                <Text style={s.breakdownLabel}>{cfg.label}</Text>
                                                <Text style={[s.breakdownVal, { color: cfg.color }]}>-{fmt(val)}</Text>
                                            </View>
                                        );
                                    })}
                                <View style={s.breakdownRow}>
                                    <View style={[s.breakdownIcon, { backgroundColor: CHART_GREEN + "22" }]}>
                                        <Ionicons name="cash" size={13} color={CHART_GREEN} />
                                    </View>
                                    <Text style={s.breakdownLabel}>Loyers perçus</Text>
                                    <Text style={[s.breakdownVal, { color: CHART_GREEN }]}>+{fmt(selected.details.loyers)}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* ── Table mensuelle ── */}
                <Text style={s.sectionTitle}>Récapitulatif mensuel</Text>
                <View style={s.table}>
                    {/* Header */}
                    <View style={[s.tableRow, s.tableHeader]}>
                        <Text style={s.thCell}>Mois</Text>
                        <Text style={[s.thCell, { textAlign: "right" }]}>Entrées</Text>
                        <Text style={[s.thCell, { textAlign: "right" }]}>Sorties</Text>
                        <Text style={[s.thCell, { textAlign: "right" }]}>Solde</Text>
                    </View>
                    {DATA_2025.map((d, i) => {
                        const net = d.in - d.out;
                        const isActive = activeMonth === i;
                        return (
                            <Pressable key={i} style={[s.tableRow, isActive && s.tableRowActive]} onPress={() => setActiveMonth(isActive ? null : i)}>
                                <Text style={s.tdMonth}>{d.m}</Text>
                                <Text style={[s.tdCell, { color: CHART_GREEN }]}>+{fmt(d.in)}</Text>
                                <Text style={[s.tdCell, { color: colors.semantic.danger }]}>-{fmt(d.out)}</Text>
                                <Text style={[s.tdCell, { color: net >= 0 ? CHART_GREEN : colors.semantic.danger, fontWeight: "700" }]}>
                                    {net >= 0 ? "+" : ""}{fmt(net)}
                                </Text>
                            </Pressable>
                        );
                    })}
                    {/* Total */}
                    <View style={[s.tableRow, s.tableTotal]}>
                        <Text style={s.totalLabel}>Total</Text>
                        <Text style={[s.tdCell, { color: CHART_GREEN, fontWeight: "800" }]}>+{fmt(totalIn)}</Text>
                        <Text style={[s.tdCell, { color: colors.semantic.danger, fontWeight: "800" }]}>-{fmt(totalOut)}</Text>
                        <Text style={[s.tdCell, { color: balance >= 0 ? CHART_GREEN : colors.semantic.danger, fontWeight: "800" }]}>
                            {balance >= 0 ? "+" : ""}{fmt(balance)}
                        </Text>
                    </View>
                </View>

                {/* ── Astuce ── */}
                <View style={s.tipCard}>
                    <Ionicons name="bulb-outline" size={18} color="#D29922" />
                    <Text style={s.tipTxt}>
                        💡 Attention : Juin et Octobre sont des mois de dépenses exceptionnelles (travaux + taxes foncières).
                        Pensez à provisionner ~300 €/mois pour lisser ces pics.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function KpiTile({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    return (
        <View style={[s.kpiTile, { borderColor: color + "40" }]}>
            <View style={[s.kpiIcon, { backgroundColor: color + "18" }]}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text style={[s.kpiVal, { color }]}>{value}</Text>
            <Text style={s.kpiLbl}>{label}</Text>
        </View>
    );
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
            <Text style={s.legendTxt}>{label}</Text>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.bg },

    scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 100, gap: spacing.md },

    // KPI
    kpiRow: { flexDirection: "row", gap: spacing.sm },
    kpiTile: {
        flex: 1, backgroundColor: PALETTE.card, borderRadius: radii.lg,
        padding: spacing.sm, alignItems: "center", borderWidth: 1, gap: 4,
    },
    kpiIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    kpiVal: { fontSize: 11, fontWeight: "700", color: "#F0F6FC", textAlign: "center" },
    kpiLbl: { fontSize: 8, color: PALETTE.dim, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.3 },

    // Avg row
    avgRow: {
        flexDirection: "row", backgroundColor: PALETTE.card, borderRadius: radii.xl,
        padding: spacing.md, borderWidth: 1, borderColor: PALETTE.border,
    },
    avgItem: { flex: 1, alignItems: "center", gap: 4 },
    avgDivider: { width: 1, backgroundColor: PALETTE.border },
    avgLabel: { fontSize: 9, color: PALETTE.dim, textTransform: "uppercase", letterSpacing: 0.3, textAlign: "center" },
    avgValue: { fontSize: typography.size.small, fontWeight: "700" },

    // Chart card
    chartCard: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border, gap: spacing.sm,
    },
    chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
    chartTitle: { flex: 1, fontSize: typography.size.small, fontWeight: "600", color: "#C9D1D9", lineHeight: 17 },
    legend: { flexDirection: "row", gap: spacing.xs },
    legendTxt: { fontSize: typography.size.xs, color: PALETTE.dim },

    gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.04)" },
    barsRow: { flexDirection: "row", alignItems: "flex-end", paddingBottom: 0 },
    barCol: { flex: 1, alignItems: "center", paddingBottom: 0 },
    barPair: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
    barRev: { width: 7, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: colors.semantic.success }, // 🟢 Chart revenue bar — stays green
    barExp: { width: 7, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: "#F85149" },
    netDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
    barLabel: { fontSize: 8, color: PALETTE.dim, marginTop: 2 },

    // Tooltip
    tooltip: {
        backgroundColor: PALETTE.cardElevated, borderRadius: radii.lg, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border, gap: 10,
    },
    tooltipHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    tooltipMonth: { fontSize: typography.size.body, fontWeight: "700", color: "#F0F6FC" },
    tooltipNet: { fontSize: typography.size.small, fontWeight: "700" },
    tooltipRow: { flexDirection: "row" },
    tooltipBlock: { flex: 1, alignItems: "center" },
    tooltipSep: { width: 1, backgroundColor: PALETTE.border },
    tooltipLabel: { fontSize: typography.size.xs, color: PALETTE.dim, textTransform: "uppercase", letterSpacing: 0.3 },
    tooltipVal: { fontSize: typography.size.body, fontWeight: "700", marginTop: 3 },

    breakdownTitle: { fontSize: typography.size.xs, color: PALETTE.dim, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
    breakdownList: { gap: 6 },
    breakdownRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    breakdownIcon: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    breakdownLabel: { flex: 1, fontSize: typography.size.small, color: "#C9D1D9" },
    breakdownVal: { fontSize: typography.size.small, fontWeight: "700" },

    // Section
    sectionTitle: { fontSize: typography.size.h3, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.2 },

    // Table
    table: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl, borderWidth: 1,
        borderColor: PALETTE.border, overflow: "hidden",
    },
    tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderColor: PALETTE.border },
    tableHeader: { backgroundColor: PALETTE.cardElevated },
    tableRowActive: { backgroundColor: PALETTE.green + "15" },
    tableTotal: { backgroundColor: PALETTE.cardElevated, borderBottomWidth: 0 },
    thCell: { flex: 1, fontSize: 9, color: PALETTE.dim, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
    tdMonth: { flex: 1, fontSize: typography.size.small, color: "#F0F6FC", fontWeight: "600" },
    tdCell: { flex: 1, fontSize: typography.size.small, textAlign: "right" },
    totalLabel: { flex: 1, fontSize: typography.size.small, color: "#F0F6FC", fontWeight: "800" },

    // Tip
    tipCard: {
        flexDirection: "row", alignItems: "flex-start", gap: 10,
        backgroundColor: "#D2992215", borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: "#D2992230",
    },
    tipTxt: { flex: 1, fontSize: typography.size.small, color: "#C9D1D9", lineHeight: 19 },
});
