import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { NavHeader } from "@/src/components/shared/ui/NavHeader";

// 🟢 Vert réservé aux valeurs financières (rendement, revenus, cashflow positif)
const CHART_GREEN = colors.semantic.success;

const { width } = Dimensions.get("window");

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_PROPERTIES: Record<string, any> = {
    "1": {
        title: "Studio Bastille",
        address: "12 rue de la Roquette, Paris 11e",
        type: "Appartement",
        typeIcon: "business",
        area: 38,
        rooms: 1,
        constructionYear: 2003,
        purchasePrice: 285000,
        occupancy: 100,
        status: "Loué",
        statusColor: colors.semantic.success,
        tenant: "Jean Dupont",
        leaseEnd: "31/08/2026",
        monthlyRent: 1200,
        monthlyCharges: 320,
        propertyTax: 1200,
        grossYield: 6.2,
        netYield: 4.8,
        dpe: "C",
        ges: "D",
        dpeColor: "#22c55e",
    },
    "2": {
        title: "T2 Lille Centre",
        address: "8 rue Inkermann, Lille",
        type: "Appartement",
        typeIcon: "business",
        area: 55,
        rooms: 2,
        constructionYear: 1998,
        purchasePrice: 185000,
        occupancy: 100,
        status: "Loué",
        statusColor: colors.semantic.success,
        tenant: "Marie Martin",
        leaseEnd: "30/06/2025",
        monthlyRent: 950,
        monthlyCharges: 210,
        propertyTax: 900,
        grossYield: 7.1,
        netYield: 5.4,
        dpe: "D",
        ges: "D",
        dpeColor: "#f59e0b",
    },
    "3": {
        title: "Maison Vincennes",
        address: "3 rue de Montreuil, Vincennes",
        type: "Maison",
        typeIcon: "home",
        area: 112,
        rooms: 5,
        constructionYear: 1975,
        purchasePrice: 620000,
        occupancy: 0,
        status: "Disponible",
        statusColor: colors.secondary,
        tenant: null,
        leaseEnd: null,
        monthlyRent: 0,
        monthlyCharges: 180,
        propertyTax: 2200,
        grossYield: 4.9,
        netYield: 3.2,
        dpe: "E",
        ges: "E",
        dpeColor: "#ef4444",
    },
};

const CHART_DATA = [
    { m: "Juil", rev: 1200, exp: 320 },
    { m: "Aoû", rev: 1200, exp: 310 },
    { m: "Sep", rev: 1200, exp: 340 },
    { m: "Oct", rev: 1200, exp: 295 },
    { m: "Nov", rev: 1200, exp: 320 },
    { m: "Déc", rev: 1200, exp: 450 },
    { m: "Jan", rev: 1200, exp: 310 },
    { m: "Fév", rev: 1200, exp: 318 },
];

const DOCUMENTS = [
    { id: 1, name: "Bail de location 2024", type: "PDF", size: "1,2 Mo", date: "01/09/2024", icon: "document-text" as const, color: PALETTE.purple },
    { id: 2, name: "DPE certifié", type: "PDF", size: "540 Ko", date: "15/06/2023", icon: "leaf" as const, color: colors.accents.warm },
    { id: 3, name: "Acte de vente notarié", type: "PDF", size: "3,8 Mo", date: "22/03/2020", icon: "shield-checkmark" as const, color: PALETTE.purple },
    { id: 4, name: "Quittances Q3 2024", type: "PDF", size: "280 Ko", date: "01/10/2024", icon: "receipt" as const, color: colors.accents.cool },
];

const ECHEANCES = [
    { id: 1, date: "05 Mars 2025", label: "Loyer — Studio Bastille", amount: "+1 200 €", kind: "credit" as const },
    { id: 2, date: "15 Mars 2025", label: "Charges copropriété", amount: "-180 €", kind: "debit" as const },
    { id: 3, date: "31 Mars 2025", label: "Assurance PNO", amount: "-45 €", kind: "debit" as const },
    { id: 4, date: "05 Avr  2025", label: "Loyer — Studio Bastille", amount: "+1 200 €", kind: "credit" as const },
    { id: 5, date: "30 Août 2025", label: "Fin de bail — locataire", amount: "⚠", kind: "alert" as const },
];

// ─── Screen ─────────────────────────────────────────────────────────────────
type Tab = "perf" | "docs" | "echeances";

export default function PropertyDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const d = MOCK_PROPERTIES[id ?? "1"] ?? MOCK_PROPERTIES["1"];
    const [tab, setTab] = useState<Tab>("perf");

    const cashflow = d.monthlyRent - d.monthlyCharges;
    const annualRev = d.monthlyRent * 12;
    const annualChg = d.monthlyCharges * 12 + d.propertyTax;
    const annualResult = annualRev - annualChg;

    return (
        <SafeAreaView style={s.safe} edges={["top"]}>
            <StatusBar style="light" />

            {/* ─ Header ─ */}
            <NavHeader
                title={d.title}
                subtitle={d.address}
                rightAction={{ icon: "create-outline", onPress: () => { } }}
            />

            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                {/* ─ Hero ─ */}
                <View style={s.hero}>
                    <View style={s.heroLeft}>
                        <View style={s.heroIconWrap}>
                            <Ionicons name={d.typeIcon} size={28} color={PALETTE.purple} />
                        </View>
                        <View style={{ gap: 3 }}>
                            {/* Status chip */}
                            <View style={s.statusRow}>
                                <View style={[s.dot, { backgroundColor: d.statusColor }]} />
                                <Text style={[s.statusTxt, { color: d.statusColor }]}>{d.status}</Text>
                            </View>
                            <Text style={s.heroMeta}>{d.area} m²  ·  {d.rooms} pièce(s)  ·  {d.type}</Text>
                            <Text style={s.heroMeta}>Construit en {d.constructionYear}</Text>
                        </View>
                    </View>
                    {/* DPE badge */}
                    <View style={[s.dpeBadge, { borderColor: d.dpeColor + "55" }]}>
                        <Text style={[s.dpeLetterLabel, { color: d.dpeColor }]}>DPE</Text>
                        <Text style={[s.dpeLetter, { color: d.dpeColor }]}>{d.dpe}</Text>
                    </View>
                </View>

                {/* ─ Tabs ─ */}
                <View style={s.tabRow}>
                    {(["perf", "docs", "echeances"] as Tab[]).map((t) => (
                        <Pressable key={t} style={[s.tabBtn, tab === t && s.tabBtnActive]} onPress={() => setTab(t)}>
                            <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>
                                {t === "perf" ? "Performance" : t === "docs" ? "Documents" : "Échéances"}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* ─ Tab: Performance ─ */}
                {tab === "perf" && <>
                    {/* KPI 2×3 grid */}
                    <View style={s.kpiGrid}>
                        <KpiBlock icon="trending-up" label="Rendement brut" value={`${d.grossYield}%`} color={CHART_GREEN} />
                        <KpiBlock icon="shield-checkmark" label="Rendement net" value={`${d.netYield}%`} color={CHART_GREEN} />
                        <KpiBlock icon="cash" label="Cash-flow/mois" value={cashflow >= 0 ? `+${cashflow} €` : `${cashflow} €`} color={cashflow >= 0 ? colors.semantic.success : colors.semantic.danger} />
                        <KpiBlock icon="people" label="Occupation" value={`${d.occupancy}%`} color={PALETTE.purple} />
                        <KpiBlock icon="home" label="Prix d'achat" value={`${(d.purchasePrice / 1000).toFixed(0)}k €`} color={PALETTE.dim} />
                        {d.leaseEnd
                            ? <KpiBlock icon="calendar" label="Fin de bail" value={d.leaseEnd} color={colors.semantic.warning ?? "#f59e0b"} />
                            : <KpiBlock icon="calendar" label="Fin de bail" value="—" color={PALETTE.dim} />
                        }
                    </View>

                    {/* Tenant card */}
                    {d.tenant && (
                        <View style={s.tenantCard}>
                            <View style={s.tenantAvatar}>
                                <Text style={s.tenantInitials}>
                                    {d.tenant.split(" ").map((n: string) => n[0]).join("")}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.tenantName}>{d.tenant}</Text>
                                <Text style={s.tenantMeta}>Locataire · Bail jusqu'au {d.leaseEnd}</Text>
                            </View>
                            <Pressable style={s.tenantMailBtn}>
                                <Ionicons name="mail-outline" size={18} color={PALETTE.purple} />
                            </Pressable>
                        </View>
                    )}

                    {/* Chart */}
                    <Text style={s.sectionTitle}>Flux financiers — 8 derniers mois</Text>
                    <View style={s.chartCard}>
                        {/* Legend */}
                        <View style={s.chartLegend}>
                            <LegendDot color={CHART_GREEN} label="Revenus" />
                            <LegendDot color={colors.semantic.danger} label="Dépenses" />
                            <Text style={s.chartKpi}>
                                Solde : {annualResult >= 0 ? "+" : ""}{annualResult.toLocaleString("fr-FR")} €/an
                            </Text>
                        </View>
                        <CashFlowChart data={CHART_DATA} />
                    </View>

                    {/* Annual bilan */}
                    <View style={s.bilanCard}>
                        <Text style={s.bilanTitle}>Bilan annuel estimé</Text>
                        <View style={s.bilanRow}>
                            <BilanItem label="Revenus bruts" value={`+${annualRev.toLocaleString("fr-FR")} €`} color={colors.semantic.success} />
                            <View style={s.bilanSep} />
                            <BilanItem label="Charges totales" value={`-${annualChg.toLocaleString("fr-FR")} €`} color={colors.semantic.danger} />
                            <View style={s.bilanSep} />
                            <BilanItem
                                label="Résultat net"
                                value={`${annualResult >= 0 ? "+" : ""}${annualResult.toLocaleString("fr-FR")} €`}
                                color={CHART_GREEN}
                                bold
                            />
                        </View>
                    </View>
                </>}

                {/* ─ Tab: Documents ─ */}
                {tab === "docs" && <>
                    <Pressable style={s.uploadBtn}>
                        <Ionicons name="cloud-upload-outline" size={18} color={PALETTE.purple} />
                        <Text style={s.uploadTxt}>Ajouter un document</Text>
                    </Pressable>
                    <View style={{ gap: 8 }}>
                        {DOCUMENTS.map(doc => (
                            <Pressable key={doc.id} style={s.docCard}>
                                <View style={[s.docIcon, { backgroundColor: doc.color + "22" }]}>
                                    <Ionicons name={doc.icon} size={20} color={doc.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.docName}>{doc.name}</Text>
                                    <Text style={s.docMeta}>{doc.type} · {doc.size} · {doc.date}</Text>
                                </View>
                                <Ionicons name="download-outline" size={18} color={PALETTE.dim} />
                            </Pressable>
                        ))}
                    </View>
                </>}

                {/* ─ Tab: Échéances ─ */}
                {tab === "echeances" && (
                    <View style={{ gap: 8 }}>
                        {ECHEANCES.map(e => {
                            const isCredit = e.kind === "credit";
                            const isAlert = e.kind === "alert";
                            const amountClr = isCredit ? colors.semantic.success : isAlert ? "#f59e0b" : colors.semantic.danger;
                            const bg = isCredit ? colors.semantic.success + "22" : isAlert ? "#f59e0b22" : colors.semantic.danger + "22";
                            const icon = isCredit ? "arrow-down-circle" as const : isAlert ? "warning" as const : "arrow-up-circle" as const;
                            return (
                                <View key={e.id} style={s.ech}>
                                    <View style={[s.echIcon, { backgroundColor: bg }]}>
                                        <Ionicons name={icon} size={18} color={amountClr} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.echLabel}>{e.label}</Text>
                                        <Text style={s.echDate}>{e.date}</Text>
                                    </View>
                                    <Text style={[s.echAmount, { color: amountClr }]}>{e.amount}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function KpiBlock({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    return (
        <View style={[s.kpiBlock, { borderColor: color + "40" }]}>
            <View style={[s.kpiBlockIcon, { backgroundColor: color + "22" }]}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text style={[s.kpiBlockVal, { color }]}>{value}</Text>
            <Text style={s.kpiBlockLbl}>{label}</Text>
        </View>
    );
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: color }]} />
            <Text style={s.legendTxt}>{label}</Text>
        </View>
    );
}

function BilanItem({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
    return (
        <View style={s.bilanItem}>
            <Text style={s.bilanLbl}>{label}</Text>
            <Text style={[s.bilanVal, { color }, bold && { fontWeight: "800" }]}>{value}</Text>
        </View>
    );
}

function CashFlowChart({ data }: { data: typeof CHART_DATA }) {
    const maxVal = Math.max(...data.map(d => Math.max(d.rev, d.exp)));
    const CHART_H = 100;
    return (
        <View>
            {/* Y-axis ghost lines */}
            <View style={StyleSheet.absoluteFill}>
                {[0.25, 0.5, 0.75].map((f) => (
                    <View key={f} style={[s.gridLine, { top: `${(1 - f) * 75}%` as any }]} />
                ))}
            </View>
            <View style={s.chartBars}>
                {data.map((d, i) => (
                    <View key={i} style={s.barCol}>
                        <View style={s.barPair}>
                            <View style={[s.barRev, { height: Math.max(6, (d.rev / maxVal) * CHART_H) }]} />
                            <View style={[s.barExp, { height: Math.max(6, (d.exp / maxVal) * CHART_H) }]} />
                        </View>
                        <Text style={s.barLabel}>{d.m}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.bg },

    // Header
    header: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        paddingHorizontal: spacing.screenPadding, paddingTop: 4, paddingBottom: 12,
    },
    iconBtn: {
        width: 38, height: 38, borderRadius: 19, backgroundColor: PALETTE.card,
        alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: PALETTE.border,
    },
    headerTitle: { fontSize: typography.size.h3, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.2 },
    headerSub: { fontSize: typography.size.xs, color: PALETTE.dim, marginTop: 1 },

    scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 100, gap: spacing.md },

    // Hero
    hero: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    heroLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 },
    heroIconWrap: {
        width: 52, height: 52, borderRadius: radii.md,
        backgroundColor: PALETTE.purpleDim, alignItems: "center", justifyContent: "center",
    },
    statusRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusTxt: { fontSize: typography.size.xs, fontWeight: "700" },
    heroMeta: { fontSize: typography.size.xs, color: PALETTE.dim, lineHeight: 18 },
    dpeBadge: {
        width: 50, height: 50, borderRadius: radii.md, backgroundColor: PALETTE.cardElevated,
        alignItems: "center", justifyContent: "center", borderWidth: 1.5,
    },
    dpeLetterLabel: { fontSize: 9, fontWeight: "700", textTransform: "uppercase" },
    dpeLetter: { fontSize: 22, fontWeight: "800" },

    // Tabs
    tabRow: {
        flexDirection: "row", backgroundColor: PALETTE.card, borderRadius: radii.pill,
        padding: 4, borderWidth: 1, borderColor: PALETTE.border,
    },
    tabBtn: { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: radii.pill },
    tabBtnActive: { backgroundColor: PALETTE.green },
    tabTxt: { fontSize: typography.size.small, fontWeight: "600", color: PALETTE.dim },
    tabTxtActive: { color: "#fff" },

    // KPI grid
    kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    kpiBlock: {
        width: "30.7%", backgroundColor: PALETTE.card, borderRadius: radii.lg,
        padding: spacing.sm, alignItems: "center", borderWidth: 1, gap: 4,
    },
    kpiBlockIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    kpiBlockVal: { fontSize: typography.size.body, fontWeight: "700" },
    kpiBlockLbl: { fontSize: 9, color: "#8B949E", textAlign: "center", textTransform: "uppercase", letterSpacing: 0.3 },

    // Tenant
    tenantCard: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    tenantAvatar: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: PALETTE.purpleDim,
        alignItems: "center", justifyContent: "center",
    },
    tenantInitials: { color: PALETTE.purple, fontWeight: "800", fontSize: 15 },
    tenantName: { fontSize: typography.size.body, fontWeight: "700", color: "#F0F6FC" },
    tenantMeta: { fontSize: typography.size.xs, color: PALETTE.dim, marginTop: 2 },
    tenantMailBtn: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: PALETTE.purpleDim,
        alignItems: "center", justifyContent: "center",
    },

    sectionTitle: { fontSize: typography.size.h3, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.2 },

    // Chart
    chartCard: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    chartLegend: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendTxt: { fontSize: typography.size.xs, color: "#C9D1D9", fontWeight: "500" },
    chartKpi: { marginLeft: "auto" as any, fontSize: typography.size.xs, color: colors.semantic.success, fontWeight: "700" },
    chartBars: { flexDirection: "row", alignItems: "flex-end", height: 130, paddingBottom: 20, gap: 0 },
    gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.05)" },
    barCol: { flex: 1, alignItems: "center" },
    barPair: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
    barRev: { width: 9, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: colors.semantic.success }, // 🟢 Chart revenue
    barExp: { width: 9, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: colors.semantic.danger }, // 🔴 Chart expenses
    barLabel: { fontSize: 9, color: PALETTE.dim, marginTop: 4 },

    // Bilan
    bilanCard: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    bilanTitle: { fontSize: typography.size.body, fontWeight: "700", color: "#F0F6FC", marginBottom: spacing.sm },
    bilanRow: { flexDirection: "row" },
    bilanItem: { flex: 1, alignItems: "center" },
    bilanSep: { width: 1, backgroundColor: PALETTE.border },
    bilanLbl: { fontSize: typography.size.xs, color: "#8B949E", textAlign: "center", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 },
    bilanVal: { fontSize: typography.size.body, fontWeight: "700", textAlign: "center" },

    // Documents
    uploadBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        paddingVertical: 14, borderRadius: radii.xl, borderWidth: 1.5,
        borderColor: PALETTE.purple, borderStyle: "dashed", backgroundColor: PALETTE.purpleDim,
    },
    uploadTxt: { color: PALETTE.purple, fontWeight: "700", fontSize: typography.size.body },
    docCard: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    docIcon: { width: 42, height: 42, borderRadius: radii.md, alignItems: "center", justifyContent: "center" },
    docName: { fontSize: typography.size.small, fontWeight: "700", color: "#F0F6FC" },
    docMeta: { fontSize: typography.size.xs, color: PALETTE.dim, marginTop: 2 },

    // Échéances
    ech: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    echIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
    echLabel: { fontSize: typography.size.small, fontWeight: "600", color: "#F0F6FC" },
    echDate: { fontSize: typography.size.xs, color: PALETTE.dim, marginTop: 2 },
    echAmount: { fontSize: typography.size.body, fontWeight: "700" },
});
