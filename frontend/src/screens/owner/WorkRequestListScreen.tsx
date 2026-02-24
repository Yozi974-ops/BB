import React, { useState } from "react";
import {
    View, Text, ScrollView, StyleSheet, Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

// ─── Types & mock data ────────────────────────────────────────────────────────
type WRStatus = "brouillon" | "en_cours" | "devis_reçu" | "accepte" | "termine";

interface WorkRequest {
    id: string;
    title: string;
    property: string;
    category: string;
    categoryIcon: any;
    status: WRStatus;
    createdAt: string;
    devisAmount?: number;
    pro?: string;
    urgence: boolean;
}

const MOCK: WorkRequest[] = [
    {
        id: "1",
        title: "Fuite robinet salle de bain",
        property: "Studio Bastille",
        category: "Plomberie",
        categoryIcon: "water",
        status: "devis_reçu",
        createdAt: "18/02/2025",
        devisAmount: 280,
        pro: "Marc Dubois",
        urgence: true,
    },
    {
        id: "2",
        title: "Mise aux normes tableau électrique",
        property: "T2 Lille Centre",
        category: "Électricité",
        categoryIcon: "flash",
        status: "en_cours",
        createdAt: "15/02/2025",
        pro: "Sophie Martin",
        urgence: false,
    },
    {
        id: "3",
        title: "Ravalement façade — devis",
        property: "Studio Bastille",
        category: "Maçonnerie",
        categoryIcon: "construct",
        status: "accepte",
        createdAt: "10/02/2025",
        devisAmount: 4800,
        pro: "Jean-Pierre Roux",
        urgence: false,
    },
    {
        id: "4",
        title: "Remplacement chaudière",
        property: "Maison Vincennes",
        category: "Chauffage",
        categoryIcon: "flame",
        status: "termine",
        createdAt: "02/01/2025",
        devisAmount: 3200,
        pro: "Atelier Thermique",
        urgence: false,
    },
];

const STATUS_CFG: Record<WRStatus, { label: string; color: string; icon: any }> = {
    brouillon: { label: "Brouillon", color: PALETTE.dim, icon: "create-outline" },
    en_cours: { label: "En cours", color: "#58A6FF", icon: "time-outline" },
    devis_reçu: { label: "Devis reçu", color: "#D29922", icon: "document-text" },
    accepte: { label: "Accepté", color: colors.semantic.success, icon: "checkmark-circle" },
    termine: { label: "Terminé", color: PALETTE.purple, icon: "checkmark-done-circle" },
};

const FILTERS: { id: WRStatus | "all"; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "en_cours", label: "En cours" },
    { id: "devis_reçu", label: "Devis reçu" },
    { id: "accepte", label: "Acceptés" },
    { id: "termine", label: "Terminés" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function WorkRequestListScreen() {
    const [filter, setFilter] = useState<WRStatus | "all">("all");

    const filtered = filter === "all" ? MOCK : MOCK.filter(w => w.status === filter);

    const kpis = {
        total: MOCK.length,
        enCours: MOCK.filter(w => w.status === "en_cours" || w.status === "devis_reçu").length,
        termine: MOCK.filter(w => w.status === "termine").length,
        budget: MOCK.filter(w => w.devisAmount).reduce((s, w) => s + (w.devisAmount ?? 0), 0),
    };

    return (
        <SafeAreaView style={s.safe} edges={["top"]}>
            <StatusBar style="light" />

            {/* ── Header ── */}
            <View style={s.header}>
                <View>
                    <Text style={s.headerSuper}>Gestion</Text>
                    <Text style={s.headerTitle}>Mes Travaux</Text>
                </View>
                <Pressable
                    style={s.newBtn}
                    onPress={() => router.push("/work-request/creation" as any)}
                    accessibilityLabel="Nouvelle demande de travaux"
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={s.newBtnTxt}>Nouveau</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                {/* ── KPI Strip ── */}
                <View style={s.kpiRow}>
                    <KpiTile icon="list" label="Total" value={String(kpis.total)} color={PALETTE.dim} />
                    <KpiTile icon="time" label="En cours" value={String(kpis.enCours)} color="#58A6FF" />
                    <KpiTile icon="checkmark-done" label="Terminés" value={String(kpis.termine)} color={PALETTE.purple} />
                    <KpiTile icon="cash" label="Budget" value={`${kpis.budget.toLocaleString("fr-FR")} €`} color={PALETTE.green} />
                </View>

                {/* ── Filters ── */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
                    {FILTERS.map(f => (
                        <Pressable
                            key={f.id}
                            style={[s.filterChip, filter === f.id && s.filterChipActive]}
                            onPress={() => setFilter(f.id as any)}
                        >
                            <Text style={[s.filterChipTxt, filter === f.id && s.filterChipTxtActive]}>
                                {f.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* ── Work Request Cards ── */}
                <View style={s.list}>
                    {filtered.map(wr => {
                        const cfg = STATUS_CFG[wr.status];
                        return (
                            <Pressable key={wr.id} style={s.card}>
                                {/* Top row */}
                                <View style={s.cardTop}>
                                    <View style={[s.catIcon, { backgroundColor: cfg.color + "20" }]}>
                                        <Ionicons name={wr.categoryIcon} size={18} color={cfg.color} />
                                    </View>
                                    <View style={{ flex: 1, gap: 2 }}>
                                        <View style={s.titleRow}>
                                            <Text style={s.cardTitle} numberOfLines={1}>{wr.title}</Text>
                                            {wr.urgence && (
                                                <View style={s.urgenceBadge}>
                                                    <Text style={s.urgenceTxt}>⚡ Urgent</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={s.cardProperty}>{wr.property} · {wr.category}</Text>
                                    </View>
                                </View>

                                {/* Status + date */}
                                <View style={s.cardMid}>
                                    <View style={[s.statusBadge, { backgroundColor: cfg.color + "20" }]}>
                                        <Ionicons name={cfg.icon} size={12} color={cfg.color} />
                                        <Text style={[s.statusTxt, { color: cfg.color }]}>{cfg.label}</Text>
                                    </View>
                                    <Text style={s.cardDate}>{wr.createdAt}</Text>
                                </View>

                                {/* Pro + devis */}
                                {(wr.pro || wr.devisAmount) && (
                                    <View style={s.cardFooter}>
                                        {wr.pro && (
                                            <View style={s.proRow}>
                                                <Ionicons name="person-circle-outline" size={14} color={PALETTE.dim} />
                                                <Text style={s.proTxt}>{wr.pro}</Text>
                                            </View>
                                        )}
                                        {wr.devisAmount && (
                                            <View style={[s.devisBadge, { backgroundColor: PALETTE.green + "20" }]}>
                                                <Text style={s.devisAmt}>{wr.devisAmount.toLocaleString("fr-FR")} €</Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Action button for pending devis */}
                                {wr.status === "devis_reçu" && (
                                    <View style={s.actionRow}>
                                        <Pressable style={s.acceptBtn}>
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                            <Text style={s.acceptTxt}>Accepter le devis</Text>
                                        </Pressable>
                                        <Pressable style={s.rejectBtn}>
                                            <Text style={s.rejectTxt}>Refuser</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}

                    {filtered.length === 0 && (
                        <View style={s.empty}>
                            <Ionicons name="construct-outline" size={40} color={PALETTE.dim} />
                            <Text style={s.emptyTitle}>Aucune demande</Text>
                            <Text style={s.emptyTxt}>Créez votre première demande de travaux</Text>
                            <Pressable style={s.emptyBtn} onPress={() => router.push("/work-request/creation" as any)}>
                                <Ionicons name="add" size={16} color="#fff" />
                                <Text style={s.emptyBtnTxt}>Créer une demande</Text>
                            </Pressable>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function KpiTile({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    return (
        <View style={[s.kpiTile, { borderColor: color + "30" }]}>
            <Ionicons name={icon} size={16} color={color} />
            <Text style={[s.kpiVal, { color }]}>{value}</Text>
            <Text style={s.kpiLbl}>{label}</Text>
        </View>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.bg },

    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: spacing.screenPadding, paddingTop: spacing.sm, paddingBottom: spacing.md,
    },
    headerSuper: { fontSize: typography.size.xs, color: PALETTE.green, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
    headerTitle: { fontSize: typography.size.h1, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.5 },
    newBtn: {
        flexDirection: "row", alignItems: "center", gap: 5,
        backgroundColor: PALETTE.green, paddingVertical: 9, paddingHorizontal: 14, borderRadius: radii.pill,
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    newBtnTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.small },

    scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 120, gap: spacing.md },

    kpiRow: { flexDirection: "row", gap: 8 },
    kpiTile: {
        flex: 1, backgroundColor: PALETTE.card, borderRadius: radii.lg,
        padding: 10, alignItems: "center", borderWidth: 1, gap: 3,
    },
    kpiVal: { fontSize: 13, fontWeight: "800", color: "#F0F6FC" },
    kpiLbl: { fontSize: 8, color: PALETTE.dim, textTransform: "uppercase", letterSpacing: 0.3 },

    filterRow: { paddingBottom: 4, gap: 8 },
    filterChip: {
        paddingVertical: 7, paddingHorizontal: 14, borderRadius: radii.pill,
        backgroundColor: PALETTE.card, borderWidth: 1, borderColor: PALETTE.border,
    },
    filterChipActive: { backgroundColor: PALETTE.green, borderColor: PALETTE.green },
    filterChipTxt: { fontSize: typography.size.small, fontWeight: "600", color: PALETTE.dim },
    filterChipTxtActive: { color: "#fff" },

    list: { gap: 10 },

    card: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border, gap: 10,
    },
    cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    catIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
    cardTitle: { fontSize: typography.size.body, fontWeight: "700", color: "#F0F6FC", flex: 1 },
    cardProperty: { fontSize: typography.size.xs, color: PALETTE.dim },
    urgenceBadge: { backgroundColor: "#F8514920", paddingVertical: 2, paddingHorizontal: 7, borderRadius: radii.pill },
    urgenceTxt: { fontSize: 10, fontWeight: "700", color: colors.semantic.danger },

    cardMid: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
    statusTxt: { fontSize: typography.size.xs, fontWeight: "700" },
    cardDate: { fontSize: typography.size.xs, color: PALETTE.dim },

    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    proRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    proTxt: { fontSize: typography.size.xs, color: PALETTE.dim },
    devisBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
    devisAmt: { fontSize: typography.size.small, fontWeight: "800", color: PALETTE.green },

    actionRow: { flexDirection: "row", gap: 8 },
    acceptBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
        backgroundColor: PALETTE.green, paddingVertical: 10, borderRadius: radii.pill,
    },
    acceptTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.small },
    rejectBtn: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: radii.pill,
        backgroundColor: PALETTE.cardElevated, borderWidth: 1, borderColor: PALETTE.border,
    },
    rejectTxt: { color: PALETTE.dim, fontWeight: "600", fontSize: typography.size.small },

    empty: { alignItems: "center", paddingVertical: spacing.xl, gap: spacing.sm },
    emptyTitle: { fontSize: typography.size.h3, fontWeight: "700", color: "#F0F6FC" },
    emptyTxt: { fontSize: typography.size.small, color: PALETTE.dim, textAlign: "center" },
    emptyBtn: {
        flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm,
        backgroundColor: PALETTE.green, paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill,
    },
    emptyBtnTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.body },
});
