import React, { useState } from "react";
import {
    View, Text, ScrollView, StyleSheet, Pressable,
    Modal, TextInput, KeyboardAvoidingView, Platform,
    Alert, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { NavHeader } from "@/src/components/shared/ui/NavHeader";

const { width } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
type SessionStatus = "en_attente" | "confirmee" | "terminee" | "annulee";

interface VideoSession {
    id: string;
    subject: string;
    description: string;
    requestedSlots: string[];
    confirmedDate?: string;
    status: SessionStatus;
    proName?: string;
    proSpecialty?: string;
    joinUrl?: string;
    createdAt: string;
}

// ─── Mock sessions ────────────────────────────────────────────────────────────
const MOCK_SESSIONS: VideoSession[] = [
    {
        id: "1",
        subject: "Problème de chaudière urgent",
        description: "Mon chauffage ne fonctionne plus depuis hier soir, besoin d'une expertise.",
        requestedSlots: ["Lun 24 Fév 10h-11h", "Mar 25 Fév 14h-15h"],
        confirmedDate: "Lun 24 Fév à 10h00",
        status: "confirmee",
        proName: "Marc Dubois",
        proSpecialty: "Plombier-Chauffagiste",
        joinUrl: "https://meet.bienbudget.com/session/abc123",
        createdAt: "21/02/2025",
    },
    {
        id: "2",
        subject: "Estimation travaux peinture",
        description: "Je souhaite refaire la peinture de mon appartement locatif avant relocation.",
        requestedSlots: ["Jeu 27 Fév 9h-10h", "Ven 28 Fév 15h-16h"],
        status: "en_attente",
        createdAt: "21/02/2025",
    },
    {
        id: "3",
        subject: "Diagnostic électrique",
        description: "Mise aux normes du tableau électrique pour le DPE.",
        requestedSlots: ["Mar 18 Fév 11h-12h"],
        confirmedDate: "Mar 18 Fév à 11h00",
        status: "terminee",
        proName: "Sophie Martin",
        proSpecialty: "Électricienne RGE",
        joinUrl: "https://meet.bienbudget.com/session/xyz789",
        createdAt: "15/02/2025",
    },
];

const SLOTS = [
    "Lundi 24 Fév  9h-10h", "Lundi 24 Fév 14h-15h",
    "Mardi 25 Fév 10h-11h", "Mardi 25 Fév 16h-17h",
    "Mercredi 26 Fév 9h-10h", "Mercredi 26 Fév 14h-15h",
    "Jeudi 27 Fév 10h-11h", "Jeudi 27 Fév 15h-16h",
    "Vendredi 28 Fév 9h-10h", "Vendredi 28 Fév 11h-12h",
];

const STATUS_CONFIG: Record<SessionStatus, { label: string; color: string; icon: any }> = {
    en_attente: { label: "En attente", color: "#D29922", icon: "hourglass-outline" },
    confirmee: { label: "Confirmée", color: colors.semantic.success, icon: "checkmark-circle" },
    terminee: { label: "Terminée", color: PALETTE.dim, icon: "checkmark-done-circle" },
    annulee: { label: "Annulée", color: colors.semantic.danger, icon: "close-circle" },
};

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function AssistanceVideoScreen() {
    const [sessions, setSessions] = useState<VideoSession[]>(MOCK_SESSIONS);
    const [showModal, setShowModal] = useState(false);

    const addSession = (s: VideoSession) => {
        setSessions(prev => [s, ...prev]);
        setShowModal(false);
    };

    const upcoming = sessions.filter(s => s.status === "confirmee" || s.status === "en_attente");
    const past = sessions.filter(s => s.status === "terminee" || s.status === "annulee");

    return (
        <SafeAreaView style={s.safe} edges={["top"]}>
            <StatusBar style="light" />

            {/* ── Header ── */}
            <NavHeader
                title="Assistance Vidéo"
                subtitle="Expertise à distance"
                accentColor={PALETTE.purple}
                rightAction={{ icon: "add", onPress: () => setShowModal(true) }}
            />

            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

                {/* ── Hero Banner ── */}
                <View style={s.heroBanner}>
                    <View style={s.heroLeft}>
                        <Text style={s.heroTitle}>Visio avec un expert</Text>
                        <Text style={s.heroSub}>
                            Obtenez des conseils en direct depuis chez vous. Partagez votre écran, posez vos documents.
                        </Text>
                        <Pressable style={s.heroBtn} onPress={() => setShowModal(true)}>
                            <Ionicons name="videocam" size={16} color="#fff" />
                            <Text style={s.heroBtnTxt}>Demander une visio</Text>
                        </Pressable>
                    </View>
                    <View style={s.heroIllustration}>
                        <Ionicons name="videocam" size={48} color={PALETTE.green + "60"} />
                    </View>
                </View>

                {/* ── Comment ça marche ── */}
                <Text style={s.sectionTitle}>Comment ça marche ?</Text>
                <View style={s.stepsRow}>
                    <StepCard n="1" icon="create-outline" label={"Décrivez\nvotre besoin"} />
                    <StepCard n="2" icon="calendar-outline" label={"Choisissez\nun créneau"} />
                    <StepCard n="3" icon="videocam-outline" label={"Visio avec\nun expert"} />
                </View>

                {/* ── Sessions à venir ── */}
                {upcoming.length > 0 && (
                    <>
                        <Text style={s.sectionTitle}>Mes visios</Text>
                        <View style={{ gap: 10 }}>
                            {upcoming.map(session => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onJoin={() =>
                                        router.push({ pathname: "/(owner)/video-call", params: { id: session.id, proName: session.proName ?? "" } } as any)
                                    }
                                />
                            ))}
                        </View>
                    </>
                )}

                {/* ── Historique ── */}
                {past.length > 0 && (
                    <>
                        <Text style={s.sectionTitle}>Historique</Text>
                        <View style={{ gap: 10 }}>
                            {past.map(session => (
                                <SessionCard key={session.id} session={session} past />
                            ))}
                        </View>
                    </>
                )}

            </ScrollView>

            {/* ── Modal Demande ── */}
            <RequestModal visible={showModal} onClose={() => setShowModal(false)} onSubmit={addSession} />
        </SafeAreaView>
    );
}

// ─── SessionCard ─────────────────────────────────────────────────────────────
function SessionCard({ session, onJoin, past }: { session: VideoSession; onJoin?: () => void; past?: boolean }) {
    const cfg = STATUS_CONFIG[session.status];
    return (
        <View style={[s.sessionCard, past && { opacity: 0.75 }]}>
            {/* Status badge */}
            <View style={s.cardTop}>
                <View style={[s.statusBadge, { backgroundColor: cfg.color + "22" }]}>
                    <Ionicons name={cfg.icon} size={13} color={cfg.color} />
                    <Text style={[s.statusTxt, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
                <Text style={s.cardDate}>{session.createdAt}</Text>
            </View>

            {/* Subject */}
            <Text style={s.cardSubject}>{session.subject}</Text>
            <Text style={s.cardDesc} numberOfLines={2}>{session.description}</Text>

            {/* Pro info */}
            {session.proName && (
                <View style={s.proRow}>
                    <View style={s.proAvatar}>
                        <Text style={s.proInitials}>{session.proName.split(" ").map(n => n[0]).join("")}</Text>
                    </View>
                    <View>
                        <Text style={s.proName}>{session.proName}</Text>
                        <Text style={s.proSpec}>{session.proSpecialty}</Text>
                    </View>
                </View>
            )}

            {/* Confirmed date */}
            {session.confirmedDate && (
                <View style={s.confirmedRow}>
                    <Ionicons name="calendar" size={13} color={PALETTE.green} />
                    <Text style={s.confirmedTxt}>{session.confirmedDate}</Text>
                </View>
            )}

            {/* Slots requested */}
            {!session.confirmedDate && (
                <View style={s.slotsWrap}>
                    {session.requestedSlots.map(sl => (
                        <View key={sl} style={s.slotChip}>
                            <Ionicons name="time-outline" size={11} color={PALETTE.dim} />
                            <Text style={s.slotTxt}>{sl}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* CTA */}
            {session.status === "confirmee" && onJoin && (
                <Pressable style={s.joinBtn} onPress={onJoin}>
                    <Ionicons name="videocam" size={16} color="#fff" />
                    <Text style={s.joinBtnTxt}>Rejoindre la visio</Text>
                </Pressable>
            )}
        </View>
    );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────
function StepCard({ n, icon, label }: { n: string; icon: any; label: string }) {
    return (
        <View style={s.stepCard}>
            <View style={s.stepNum}><Text style={s.stepNumTxt}>{n}</Text></View>
            <Ionicons name={icon} size={22} color={PALETTE.green} />
            <Text style={s.stepLabel}>{label}</Text>
        </View>
    );
}

// ─── RequestModal ─────────────────────────────────────────────────────────────
function RequestModal({ visible, onClose, onSubmit }: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (s: VideoSession) => void;
}) {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const reset = () => { setSubject(""); setDescription(""); setSelectedSlots([]); };

    const toggleSlot = (slot: string) => {
        setSelectedSlots(p => p.includes(slot) ? p.filter(s => s !== slot) : [...p, slot].slice(0, 3));
    };

    const handleSubmit = () => {
        if (!subject.trim()) return Alert.alert("Champ manquant", "Ajoutez un sujet.");
        if (!description.trim()) return Alert.alert("Champ manquant", "Décrivez votre besoin.");
        if (selectedSlots.length === 0) return Alert.alert("Créneau requis", "Sélectionnez au moins un créneau.");
        onSubmit({
            id: Date.now().toString(),
            subject: subject.trim(),
            description: description.trim(),
            requestedSlots: selectedSlots,
            status: "en_attente",
            createdAt: new Date().toLocaleDateString("fr-FR"),
        });
        reset();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <Pressable style={s.overlay} onPress={onClose} />
                <View style={s.sheet}>
                    <View style={s.handle} />
                    <Text style={s.sheetTitle}>Demander une visio</Text>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: 40 }}>

                        {/* Subject */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Sujet *</Text>
                            <TextInput
                                style={s.input} value={subject} onChangeText={setSubject}
                                placeholder="Ex : Problème de chaudière, estimation travaux…"
                                placeholderTextColor={PALETTE.dim}
                            />
                        </View>

                        {/* Description */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Description *</Text>
                            <TextInput
                                style={[s.input, { height: 90, textAlignVertical: "top", paddingTop: 12 }]}
                                value={description} onChangeText={setDescription}
                                placeholder="Décrivez votre situation en quelques lignes…"
                                placeholderTextColor={PALETTE.dim}
                                multiline
                            />
                        </View>

                        {/* Slots */}
                        <View style={s.field}>
                            <Text style={s.fieldLabel}>Créneaux disponibles * (3 max)</Text>
                            <Text style={s.fieldHint}>Sélectionnez vos disponibilités</Text>
                            <View style={s.slotsGrid}>
                                {SLOTS.map(slot => {
                                    const active = selectedSlots.includes(slot);
                                    return (
                                        <Pressable
                                            key={slot}
                                            style={[s.slotBtn, active && s.slotBtnActive]}
                                            onPress={() => toggleSlot(slot)}
                                        >
                                            <Ionicons name="time-outline" size={12} color={active ? "#fff" : PALETTE.dim} />
                                            <Text style={[s.slotBtnTxt, active && { color: "#fff" }]}>{slot}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Info */}
                        <View style={s.infoBox}>
                            <Ionicons name="information-circle-outline" size={16} color={colors.semantic.info} />
                            <Text style={s.infoTxt}>
                                Un expert vous contactera sous 2h pour confirmer votre créneau.
                                La session dure en moyenne 30 minutes.
                            </Text>
                        </View>

                        <Pressable style={s.submitBtn} onPress={handleSubmit}>
                            <Ionicons name="videocam" size={18} color="#fff" />
                            <Text style={s.submitTxt}>Envoyer la demande</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.bg },

    header: {
        flexDirection: "row", alignItems: "center", gap: spacing.sm,
        paddingHorizontal: spacing.screenPadding, paddingTop: 4, paddingBottom: 12,
    },
    backBtn: {
        width: 38, height: 38, borderRadius: 19, backgroundColor: PALETTE.card,
        alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: PALETTE.border,
    },
    headerSuper: { fontSize: typography.size.xs, color: PALETTE.purple, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
    headerTitle: { fontSize: typography.size.h2, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.3 },
    addBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: PALETTE.green,
        alignItems: "center", justifyContent: "center",
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
    },

    scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: 100, gap: spacing.md },

    // Hero banner
    heroBanner: {
        flexDirection: "row", backgroundColor: PALETTE.card, borderRadius: radii.xl,
        padding: spacing.md, borderWidth: 1, borderColor: PALETTE.green + "40", overflow: "hidden",
    },
    heroLeft: { flex: 1, gap: 8 },
    heroTitle: { fontSize: typography.size.h3, fontWeight: "700", color: "#F0F6FC" },
    heroSub: { fontSize: typography.size.small, color: PALETTE.dim, lineHeight: 19 },
    heroBtn: {
        flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start",
        backgroundColor: PALETTE.green, paddingVertical: 9, paddingHorizontal: 14,
        borderRadius: radii.pill,
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
    },
    heroBtnTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.small },
    heroIllustration: { justifyContent: "center", paddingLeft: spacing.md },

    // Section
    sectionTitle: { fontSize: typography.size.h3, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.2 },

    // Steps
    stepsRow: { flexDirection: "row", gap: 8 },
    stepCard: {
        flex: 1, backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.sm,
        alignItems: "center", gap: 6, borderWidth: 1, borderColor: PALETTE.border,
    },
    stepNum: {
        width: 22, height: 22, borderRadius: 11, backgroundColor: PALETTE.green,
        alignItems: "center", justifyContent: "center",
    },
    stepNumTxt: { fontSize: 11, fontWeight: "800", color: "#fff" },
    stepLabel: { fontSize: 10, color: PALETTE.dim, textAlign: "center", lineHeight: 14 },

    // Session card
    sessionCard: {
        backgroundColor: PALETTE.card, borderRadius: radii.xl, padding: spacing.md,
        borderWidth: 1, borderColor: PALETTE.border, gap: 8,
    },
    cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
    statusTxt: { fontSize: typography.size.xs, fontWeight: "700" },
    cardDate: { fontSize: typography.size.xs, color: PALETTE.dim },
    cardSubject: { fontSize: typography.size.body, fontWeight: "700", color: "#F0F6FC" },
    cardDesc: { fontSize: typography.size.small, color: PALETTE.dim, lineHeight: 18 },

    proRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 4 },
    proAvatar: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: PALETTE.greenDim,
        alignItems: "center", justifyContent: "center",
    },
    proInitials: { color: PALETTE.green, fontWeight: "800", fontSize: 12 },
    proName: { fontSize: typography.size.small, fontWeight: "700", color: "#F0F6FC" },
    proSpec: { fontSize: typography.size.xs, color: PALETTE.dim },

    confirmedRow: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: PALETTE.greenDim, padding: 8, borderRadius: radii.md },
    confirmedTxt: { fontSize: typography.size.small, color: PALETTE.green, fontWeight: "600" },

    slotsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    slotChip: {
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: PALETTE.cardElevated, paddingVertical: 4, paddingHorizontal: 8, borderRadius: radii.pill,
        borderWidth: 1, borderColor: PALETTE.border,
    },
    slotTxt: { fontSize: 10, color: PALETTE.dim, fontWeight: "500" },

    joinBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        backgroundColor: PALETTE.green, paddingVertical: 13, borderRadius: radii.pill,
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
    },
    joinBtnTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.body },

    // Modal
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
        position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: "92%",
        backgroundColor: PALETTE.card, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl,
        padding: spacing.lg,
    },
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: PALETTE.border, alignSelf: "center", marginBottom: spacing.md },
    sheetTitle: { fontSize: typography.size.h2, fontWeight: "700", color: "#F0F6FC", letterSpacing: -0.3, marginBottom: spacing.md },

    field: { gap: spacing.xs },
    fieldLabel: { fontSize: typography.size.small, fontWeight: "600", color: "#C9D1D9" },
    fieldHint: { fontSize: typography.size.xs, color: PALETTE.dim, marginTop: -4 },
    input: {
        backgroundColor: PALETTE.bg, borderRadius: radii.lg, padding: spacing.md,
        borderWidth: 1.5, borderColor: PALETTE.border, fontSize: typography.size.body, color: "#F0F6FC", height: 50,
    },

    slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 4 },
    slotBtn: {
        flexDirection: "row", alignItems: "center", gap: 4,
        paddingVertical: 8, paddingHorizontal: 10, borderRadius: radii.pill,
        backgroundColor: PALETTE.cardElevated, borderWidth: 1, borderColor: PALETTE.border,
    },
    slotBtnActive: { backgroundColor: PALETTE.green, borderColor: PALETTE.green },
    slotBtnTxt: { fontSize: 11, color: PALETTE.dim, fontWeight: "600" },

    infoBox: {
        flexDirection: "row", alignItems: "flex-start", gap: 9,
        backgroundColor: colors.semantic.info + "15", borderRadius: radii.lg,
        padding: spacing.sm, borderWidth: 1, borderColor: colors.semantic.info + "30",
    },
    infoTxt: { flex: 1, fontSize: typography.size.xs, color: "#C9D1D9", lineHeight: 17 },

    submitBtn: {
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
        backgroundColor: PALETTE.green, borderRadius: radii.pill, paddingVertical: 15,
        shadowColor: PALETTE.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    submitTxt: { color: "#fff", fontWeight: "700", fontSize: typography.size.body },
});
