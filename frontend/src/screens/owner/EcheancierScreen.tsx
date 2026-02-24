import React, { useState, useMemo } from "react";
import {
    View, Text, ScrollView, StyleSheet, Pressable,
    Modal, TextInput, TouchableOpacity, Dimensions, Platform,
    KeyboardAvoidingView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { NavHeader } from "@/src/components/shared/ui/NavHeader";

import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

// 🟢 Vert sémantique réservé aux graphiques et valeurs de revenus
const CHART_GREEN = colors.semantic.success;

const { width } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
type Kind = "revenu" | "depense";
type Recurrence = "unique" | "mensuelle" | "annuelle";

interface Echeance {
    id: string;
    title: string;
    date: string;       // "YYYY-MM-DD"
    kind: Kind;
    amount: number;
    recurrence: Recurrence;
    propertyId: string; // "all" | property id
}

// ─── Mock seed data ───────────────────────────────────────────────────────────
const PROPERTIES = [
    { id: "all", label: "Tous les biens" },
    { id: "1", label: "Studio Bastille" },
    { id: "2", label: "T2 Lille Centre" },
    { id: "3", label: "Maison Vincennes" },
];

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
const YEAR = 2025;

const SEED_DATA: Echeance[] = [
    { id: "1", title: "Loyer Studio Bastille", date: "2025-01-05", kind: "revenu", amount: 1200, recurrence: "mensuelle", propertyId: "1" },
    { id: "2", title: "Loyer T2 Lille", date: "2025-01-05", kind: "revenu", amount: 950, recurrence: "mensuelle", propertyId: "2" },
    { id: "3", title: "Charges copro Studio", date: "2025-01-15", kind: "depense", amount: 180, recurrence: "mensuelle", propertyId: "1" },
    { id: "4", title: "Charges copro T2", date: "2025-01-15", kind: "depense", amount: 120, recurrence: "mensuelle", propertyId: "2" },
    { id: "5", title: "Assurance PNO Studio", date: "2025-01-31", kind: "depense", amount: 45, recurrence: "mensuelle", propertyId: "1" },
    { id: "6", title: "Taxe foncière Studio", date: "2025-10-15", kind: "depense", amount: 1200, recurrence: "annuelle", propertyId: "1" },
    { id: "7", title: "Taxe foncière T2", date: "2025-10-15", kind: "depense", amount: 900, recurrence: "annuelle", propertyId: "2" },
    { id: "8", title: "Ravalement façade", date: "2025-06-01", kind: "depense", amount: 2400, recurrence: "unique", propertyId: "1" },
    { id: "9", title: "Remboursement crédit 1", date: "2025-01-05", kind: "depense", amount: 750, recurrence: "mensuelle", propertyId: "1" },
    { id: "10", title: "Remboursement crédit 2", date: "2025-01-05", kind: "depense", amount: 620, recurrence: "mensuelle", propertyId: "2" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function expandToYear(echeances: Echeance[], year: number): { month: number; kind: Kind; amount: number; propertyId: string }[] {
    const result: { month: number; kind: Kind; amount: number; propertyId: string }[] = [];
    for (const e of echeances) {
        const base = new Date(e.date);
        if (e.recurrence === "mensuelle") {
            for (let m = 0; m < 12; m++) {
                result.push({ month: m, kind: e.kind, amount: e.amount, propertyId: e.propertyId });
            }
        } else if (e.recurrence === "annuelle") {
            if (base.getFullYear() <= year) {
                result.push({ month: base.getMonth(), kind: e.kind, amount: e.amount, propertyId: e.propertyId });
            }
        } else {
            if (base.getFullYear() === year) {
                result.push({ month: base.getMonth(), kind: e.kind, amount: e.amount, propertyId: e.propertyId });
            }
        }
    }
    return result;
}

function fmt(n: number) {
    return n.toLocaleString("fr-FR") + " €";
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function EcheancierScreen() {
    const [echeances, setEcheances] = useState<Echeance[]>(SEED_DATA);
    const [filterProp, setFilterProp] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [activeMonth, setActiveMonth] = useState<number | null>(null);

    // Filtered list
    const filtered = useMemo(() =>
        filterProp === "all" ? echeances : echeances.filter(e => e.propertyId === filterProp || e.propertyId === "all"),
        [echeances, filterProp]
    );

    // Expand to monthly buckets
    const expanded = useMemo(() => expandToYear(filtered, YEAR), [filtered]);

    // Aggregate per month
    const monthData = useMemo(() => {
        return MONTHS.map((label, i) => {
            const rows = expanded.filter(e => e.month === i);
            const rev = rows.filter(r => r.kind === "revenu").reduce((s, r) => s + r.amount, 0);
            const exp = rows.filter(r => r.kind === "depense").reduce((s, r) => s + r.amount, 0);
            return { label, rev, exp, net: rev - exp };
        });
    }, [expanded]);

    const maxVal = Math.max(...monthData.flatMap(m => [m.rev, m.exp]), 1);

    // Global KPIs
    const totalRev = monthData.reduce((s, m) => s + m.rev, 0);
    const totalExp = monthData.reduce((s, m) => s + m.exp, 0);
    const balance = totalRev - totalExp;

    // Upcoming échéances (next 60 days)
    const today = new Date();
    const in60 = new Date(); in60.setDate(today.getDate() + 60);
    const upcoming = filtered
        .filter(e => e.recurrence !== "mensuelle")
        .map(e => ({ ...e, dateObj: new Date(e.date) }))
        .filter(e => e.dateObj >= today && e.dateObj <= in60)
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const addEcheance = (e: Echeance) => {
        setEcheances(prev => [...prev, e]);
        setShowModal(false);
    };

    const deleteEcheance = (id: string) => {
        Alert.alert("Supprimer", "Supprimer cette échéance ?", [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: () => setEcheances(p => p.filter(e => e.id !== id)) },
        ]);
    };

    const CHART_H = 120;

    return (
        <SafeAreaView style={s.safe} edges={["top"]}>
            <StatusBar style="auto" />

            {/* ── Header ── */}
            <NavHeader
                title={`Échéancier ${YEAR}`}
                subtitle="Flux financiers"
                accentColor="#58A6FF"
                rightAction={{ icon: "add", onPress: () => setShowModal(true) }}
            />

            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                {/* ── KPI Strip ── */}
                <View style={s.kpiRow}>
                    <KpiTile icon="trending-up" label="Revenus annuels" value={fmt(totalRev)} color={CHART_GREEN} />
                    <KpiTile icon="trending-down" label="Dépenses annuels" value={fmt(totalExp)} color={colors.semantic.danger} />
                    <KpiTile
                        icon="wallet"
                        label="Solde net"
                        value={(balance >= 0 ? "+" : "") + fmt(balance)}
                        color={balance >= 0 ? CHART_GREEN : colors.semantic.danger}
                    />
                </View>

                {/* ── Property Filter ── */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
                    {PROPERTIES.map(p => (
                        <Pressable
                            key={p.id}
                            style={[s.filterChip, filterProp === p.id && s.filterChipActive]}
                            onPress={() => setFilterProp(p.id)}
                        >
                            <Text style={[s.filterChipTxt, filterProp === p.id && s.filterChipTxtActive]}>
                                {p.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* ── Histogram ── */}
                <View style={s.chartCard}>
                    <View style={s.chartHeader}>
                        <Text style={s.chartTitle}>Flux mensuels {YEAR}</Text>
                        <View style={s.chartLegend}>
                            <LegendDot color={CHART_GREEN} label="Revenus" />
                            <LegendDot color={colors.semantic.danger} label="Dépenses" />
                        </View>
                    </View>

                    {/* Y-axis ghost lines */}
                    <View style={[s.chartArea, { height: CHART_H + 28 }]}>
                        {[0.25, 0.5, 0.75, 1].map(f => (
                            <View key={f} style={[s.gridLine, { bottom: 28 + f * CHART_H }]} />
                        ))}

                        {/* Bars */}
                        <View style={s.barsRow}>
                            {monthData.map((m, i) => {
                                const isActive = activeMonth === i;
                                const revH = Math.max(4, (m.rev / maxVal) * CHART_H);
                                const expH = Math.max(4, (m.exp / maxVal) * CHART_H);
                                return (
                                    <Pressable key={i} style={s.barCol} onPress={() => setActiveMonth(isActive ? null : i)}>
                                        <View style={s.barPair}>
                                            <View style={[s.barRev, { height: revH, opacity: isActive ? 1 : 0.85 }]} />
                                            <View style={[s.barExp, { height: expH, opacity: isActive ? 1 : 0.85 }]} />
                                        </View>
                                        <Text style={[s.barMonth, isActive && { color: CHART_GREEN, fontWeight: "700" }]}>
                                            {m.label}
                                        </Text>
                                        {isActive && (
                                            <View style={s.barTooltip}>
                                                <Text style={s.tooltipRev}>+{fmt(m.rev)}</Text>
                                                <Text style={s.tooltipExp}>-{fmt(m.exp)}</Text>
                                                <Text style={[s.tooltipNet, { color: m.net >= 0 ? CHART_GREEN : colors.semantic.danger }]}>
                                                    {m.net >= 0 ? "+" : ""}{fmt(m.net)}
                                                </Text>
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Active month detail */}
                    {activeMonth !== null && (
                        <View style={s.monthDetail}>
                            <Text style={s.monthDetailTitle}>{MONTHS[activeMonth]} {YEAR}</Text>
                            <View style={s.monthDetailRow}>
                                <MetaChip label="Revenus" value={fmt(monthData[activeMonth].rev)} color={CHART_GREEN} />
                                <MetaChip label="Dépenses" value={fmt(monthData[activeMonth].exp)} color={colors.semantic.danger} />
                                <MetaChip
                                    label="Solde"
                                    value={(monthData[activeMonth].net >= 0 ? "+" : "") + fmt(monthData[activeMonth].net)}
                                    color={monthData[activeMonth].net >= 0 ? CHART_GREEN : colors.semantic.danger}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* ── Upcoming (next 60 days) ── */}
                {upcoming.length > 0 && (
                    <>
                        <Text style={s.sectionTitle}>⚡ À venir (60 jours)</Text>
                        <View style={{ gap: 8 }}>
                            {upcoming.map(e => (
                                <EcheanceRow key={e.id} e={e} onDelete={() => deleteEcheance(e.id)} />
                            ))}
                        </View>
                    </>
                )}

                {/* ── All Échéances ── */}
                <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>Toutes les échéances</Text>
                    <Text style={s.sectionCount}>{filtered.length}</Text>
                </View>
                <View style={{ gap: 8, paddingBottom: 20 }}>
                    {filtered
                        .slice()
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(e => (
                            <EcheanceRow key={e.id} e={e} onDelete={() => deleteEcheance(e.id)} />
                        ))}
                </View>
            </ScrollView>

            {/* ── Add Modal ── */}
            <AddEcheanceModal visible={showModal} onClose={() => setShowModal(false)} onAdd={addEcheance} />
        </SafeAreaView>
    );
}

// ─── EcheanceRow ─────────────────────────────────────────────────────────────
function EcheanceRow({ e, onDelete }: { e: Echeance; onDelete: () => void }) {
    const isRev = e.kind === "revenu";
    const kindColor = isRev ? CHART_GREEN : colors.semantic.danger;
    const recIcons: Record<Recurrence, any> = { unique: "calendar", mensuelle: "refresh", annuelle: "repeat" };
    const recLabels: Record<Recurrence, string> = { unique: "Unique", mensuelle: "Mensuelle", annuelle: "Annuelle" };
    const propName = PROPERTIES.find(p => p.id === e.propertyId)?.label ?? "—";

    return (
        <View style={s.row}>
            <View style={[s.rowIcon, { backgroundColor: kindColor + "18" }]}>
                <Ionicons name={isRev ? "arrow-down-circle" : "arrow-up-circle"} size={20} color={kindColor} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{e.title}</Text>
                <View style={s.rowMeta}>
                    <Ionicons name={recIcons[e.recurrence]} size={11} color={colors.text.muted} />
                    <Text style={s.rowMetaTxt}>{recLabels[e.recurrence]}</Text>
                    <Text style={s.rowDot}>·</Text>
                    <Text style={s.rowMetaTxt}>{e.date}</Text>
                    <Text style={s.rowDot}>·</Text>
                    <Text style={s.rowMetaTxt}>{propName}</Text>
                </View>
            </View>
            <Text style={[s.rowAmount, { color: kindColor }]}>
                {isRev ? "+" : "-"}{fmt(e.amount)}
            </Text>
            <Pressable onPress={onDelete} hitSlop={8} style={s.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color={colors.text.muted} />
            </Pressable>
        </View>
    );
}

// ─── AddEcheanceModal ─────────────────────────────────────────────────────────
function AddEcheanceModal({
    visible, onClose, onAdd,
}: { visible: boolean; onClose: () => void; onAdd: (e: Echeance) => void }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [kind, setKind] = useState<Kind>("revenu");
    const [amount, setAmount] = useState("");
    const [recur, setRecur] = useState<Recurrence>("mensuelle");
    const [propId, setPropId] = useState("all");

    const reset = () => { setTitle(""); setDate(""); setKind("revenu"); setAmount(""); setRecur("mensuelle"); setPropId("all"); };

    const handleAdd = () => {
        const amt = parseFloat(amount.replace(",", "."));
        if (!title.trim()) return Alert.alert("Champ manquant", "Ajoutez un titre.");
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) return Alert.alert("Date invalide", "Format AAAA-MM-JJ requis.");
        if (isNaN(amt) || amt <= 0) return Alert.alert("Montant invalide", "Montant doit être > 0.");
        onAdd({ id: Date.now().toString(), title: title.trim(), date, kind, amount: amt, recurrence: recur, propertyId: propId });
        reset();
    };

    const RECURRENCES: { value: Recurrence; label: string; icon: any }[] = [
        { value: "unique", label: "Unique", icon: "calendar" },
        { value: "mensuelle", label: "Mensuelle", icon: "refresh" },
        { value: "annuelle", label: "Annuelle", icon: "repeat" },
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <Pressable style={s.overlay} onPress={onClose} />
                <View style={s.sheet}>
                    {/* Handle */}
                    <View style={s.handle} />
                    <Text style={s.sheetTitle}>Nouvelle échéance</Text>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: 40 }}>

                        {/* Title */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Titre *</Text>
                            <TextInput
                                style={s.input} value={title} onChangeText={setTitle}
                                placeholder="Ex : Loyer Studio Bastille"
                                placeholderTextColor={colors.text.muted}
                            />
                        </View>

                        {/* Kind toggle */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Type *</Text>
                            <View style={s.kindRow}>
                                {(["revenu", "depense"] as Kind[]).map(k => (
                                    <Pressable
                                        key={k}
                                        style={[s.kindBtn, kind === k && (k === "revenu" ? s.kindRevActive : s.kindExpActive)]}
                                        onPress={() => setKind(k)}
                                    >
                                        <Ionicons
                                            name={k === "revenu" ? "arrow-down-circle" : "arrow-up-circle"}
                                            size={16}
                                            color={kind === k ? "#fff" : colors.text.muted}
                                        />
                                        <Text style={[s.kindTxt, kind === k && { color: "#fff" }]}>
                                            {k === "revenu" ? "Revenu" : "Dépense"}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Amount */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Montant (€) *</Text>
                            <TextInput
                                style={s.input} value={amount} onChangeText={setAmount}
                                placeholder="Ex : 1200"
                                placeholderTextColor={colors.text.muted}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        {/* Date */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Date (AAAA-MM-JJ) *</Text>
                            <TextInput
                                style={s.input} value={date} onChangeText={setDate}
                                placeholder="2025-03-05"
                                placeholderTextColor={colors.text.muted}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>

                        {/* Recurrence */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Récurrence</Text>
                            <View style={s.recurRow}>
                                {RECURRENCES.map(r => (
                                    <Pressable
                                        key={r.value}
                                        style={[s.recurChip, recur === r.value && s.recurChipActive]}
                                        onPress={() => setRecur(r.value)}
                                    >
                                        <Ionicons name={r.icon} size={13} color={recur === r.value ? "#fff" : colors.text.muted} />
                                        <Text style={[s.recurChipTxt, recur === r.value && { color: "#fff" }]}>{r.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Property */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Bien associé</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    {PROPERTIES.map(p => (
                                        <Pressable
                                            key={p.id}
                                            style={[s.propChip, propId === p.id && s.propChipActive]}
                                            onPress={() => setPropId(p.id)}
                                        >
                                            <Text style={[s.propChipTxt, propId === p.id && { color: "#fff" }]}>{p.label}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Submit */}
                        <Pressable style={s.submitBtn} onPress={handleAdd}>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={s.submitTxt}>Ajouter l'échéance</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
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

function MetaChip({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <View style={[s.metaChip, { borderColor: color + "40" }]}>
            <Text style={s.metaLbl}>{label}</Text>
            <Text style={[s.metaVal, { color }]}>{value}</Text>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },

    // Header
    header: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        paddingHorizontal: spacing.screenPadding, paddingTop: 4, paddingBottom: 12,
    },
    backBtn: {
        width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface,
        alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    headerSuper: { fontSize: typography.size.xs, color: PALETTE.green, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
    headerTitle: { fontSize: typography.size.h2, fontWeight: "700", color: colors.text.heading, letterSpacing: -0.3 },
    addBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: PALETTE.green,
        alignItems: "center", justifyContent: "center",
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },

    scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 100, gap: spacing.md },

    // KPIs
    kpiRow: { flexDirection: "row", gap: spacing.sm },
    kpiTile: {
        flex: 1, backgroundColor: colors.surface, borderRadius: radii.lg,
        padding: spacing.sm, alignItems: "center", borderWidth: 1, gap: 4,
    },
    kpiIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    kpiVal: { fontSize: 12, fontWeight: "700", color: colors.text.heading, textAlign: "center" },
    kpiLbl: { fontSize: 9, color: colors.text.muted, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.3 },

    // Filter
    filterRow: { paddingBottom: 4, gap: 8 },
    filterChip: {
        paddingVertical: 7, paddingHorizontal: 13, borderRadius: radii.pill,
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    filterChipActive: { backgroundColor: PALETTE.green, borderColor: PALETTE.green },
    filterChipTxt: { fontSize: typography.size.small, fontWeight: "600", color: colors.text.muted },
    filterChipTxtActive: { color: "#fff" },

    // Chart card
    chartCard: {
        backgroundColor: colors.surface, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
    chartTitle: { fontSize: typography.size.body, fontWeight: "700", color: colors.text.heading },
    chartLegend: { flexDirection: "row", gap: spacing.sm },
    legendTxt: { fontSize: typography.size.xs, color: colors.text.muted },

    chartArea: { position: "relative" },
    gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: colors.surfaceBorder },
    barsRow: { flexDirection: "row", alignItems: "flex-end", height: 148, paddingBottom: 24 },
    barCol: { flex: 1, alignItems: "center", position: "relative" },
    barPair: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
    barRev: { width: 7, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: colors.semantic.success }, // 🟢 Chart revenue bar
    barExp: { width: 7, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: "#DC2626" },
    barMonth: { fontSize: 8, color: colors.text.muted, marginTop: 4 },

    // Tooltip
    barTooltip: {
        position: "absolute", bottom: 24, left: -20, right: -20,
        backgroundColor: colors.surface, borderRadius: radii.sm,
        padding: 4, borderWidth: 1, borderColor: colors.surfaceBorder,
        alignItems: "center", zIndex: 10,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
    },
    tooltipRev: { fontSize: 9, color: CHART_GREEN, fontWeight: "700" },
    tooltipExp: { fontSize: 9, color: colors.semantic.danger, fontWeight: "700" },
    tooltipNet: { fontSize: 9, fontWeight: "800" },

    // Month detail
    monthDetail: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.surfaceBorder },
    monthDetailTitle: { fontSize: typography.size.small, fontWeight: "700", color: colors.text.heading, marginBottom: spacing.xs },
    monthDetailRow: { flexDirection: "row", gap: 8 },
    metaChip: { flex: 1, backgroundColor: colors.surfaceElevated, borderRadius: radii.md, padding: 8, borderWidth: 1, alignItems: "center" },
    metaLbl: { fontSize: 9, color: colors.text.muted, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 2 },
    metaVal: { fontSize: 11, fontWeight: "700" },

    // Section
    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    sectionTitle: { fontSize: typography.size.h3, fontWeight: "700", color: colors.text.heading, letterSpacing: -0.2 },
    sectionCount: {
        fontSize: typography.size.xs, fontWeight: "700", color: "#fff",
        backgroundColor: PALETTE.green, borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 2,
    },

    // Row
    row: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        backgroundColor: colors.surface, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
    rowTitle: { fontSize: typography.size.small, fontWeight: "700", color: colors.text.heading },
    rowMeta: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap", marginTop: 2 },
    rowMetaTxt: { fontSize: typography.size.xs, color: colors.text.muted },
    rowDot: { fontSize: typography.size.xs, color: colors.text.muted },
    rowAmount: { fontSize: typography.size.body, fontWeight: "700" },
    deleteBtn: { padding: 4 },

    // Modal / Sheet
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: colors.surface, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl,
        padding: spacing.lg, maxHeight: "90%",
    },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.surfaceBorder, alignSelf: "center", marginBottom: spacing.md },
    sheetTitle: { fontSize: typography.size.h2, fontWeight: "700", color: colors.text.heading, letterSpacing: -0.3, marginBottom: spacing.md },

    field: { gap: spacing.xs },
    fieldLabel: { fontSize: typography.size.small, fontWeight: "600", color: colors.text.body },
    input: {
        backgroundColor: colors.background, borderRadius: radii.lg, padding: spacing.md,
        borderWidth: 1.5, borderColor: colors.surfaceBorder,
        fontSize: typography.size.body, color: colors.text.heading,
        height: 50,
    },

    kindRow: { flexDirection: "row", gap: 10 },
    kindBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
        paddingVertical: 12, borderRadius: radii.pill, backgroundColor: colors.background,
        borderWidth: 1.5, borderColor: colors.surfaceBorder,
    },
    kindRevActive: { backgroundColor: CHART_GREEN, borderColor: CHART_GREEN },
    kindExpActive: { backgroundColor: colors.semantic.danger, borderColor: colors.semantic.danger },
    kindTxt: { fontWeight: "700", fontSize: typography.size.body, color: colors.text.muted },

    recurRow: { flexDirection: "row", gap: 8 },
    recurChip: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
        paddingVertical: 9, borderRadius: radii.pill, backgroundColor: colors.background,
        borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    recurChipActive: { backgroundColor: PALETTE.purple, borderColor: PALETTE.purple },
    recurChipTxt: { fontSize: typography.size.xs, fontWeight: "600", color: colors.text.muted },

    propChip: {
        paddingVertical: 7, paddingHorizontal: 12, borderRadius: radii.pill,
        backgroundColor: colors.background, borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    propChipActive: { backgroundColor: PALETTE.green, borderColor: PALETTE.green },
    propChipTxt: { fontSize: typography.size.xs, fontWeight: "600", color: colors.text.muted },

    submitBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        backgroundColor: PALETTE.green, borderRadius: radii.pill, paddingVertical: 16,
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    submitTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.body },
});
