import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Pressable,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { NavHeader } from "@/src/components/shared/ui/NavHeader";

// ─── Mock data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: "all", label: "Tous", icon: "apps" },
    { id: "plomberie", label: "Plomberie", icon: "water" },
    { id: "electricite", label: "Électricité", icon: "flash" },
    { id: "maconnerie", label: "Maçonnerie", icon: "construct" },
    { id: "chauffage", label: "Chauffage", icon: "flame" },
    { id: "peinture", label: "Peinture", icon: "color-palette" },
    { id: "jardinage", label: "Jardinage", icon: "leaf" },
    { id: "fiscal", label: "Fiscal", icon: "document-text" },
];

const PROS = [
    {
        id: 1,
        name: "Marc Dubois",
        specialty: "Plombier certifié",
        category: "plomberie",
        rating: 4.9,
        reviews: 127,
        location: "Paris 11e",
        distance: "2,3 km",
        price: "À partir de 80€/h",
        available: true,
        verified: true,
        badge: "Top Pro",
        tags: ["Urgences", "Chaudière", "Fuites"],
    },
    {
        id: 2,
        name: "Sophie Martin",
        specialty: "Électricienne RGE",
        category: "electricite",
        rating: 4.8,
        reviews: 89,
        location: "Paris 12e",
        distance: "3,1 km",
        price: "À partir de 90€/h",
        available: true,
        verified: true,
        badge: "RGE",
        tags: ["Tableau élec.", "Domotique"],
    },
    {
        id: 3,
        name: "Jean-Pierre Roux",
        specialty: "Maçon renovateur",
        category: "maconnerie",
        rating: 4.7,
        reviews: 212,
        location: "Vincennes",
        distance: "5,8 km",
        price: "Sur devis",
        available: false,
        verified: true,
        badge: null,
        tags: ["Ravalement", "Carrelage", "Chape"],
    },
    {
        id: 4,
        name: "Atelier Thermique",
        specialty: "Chauffagiste PAC",
        category: "chauffage",
        rating: 4.6,
        reviews: 54,
        location: "Montreuil",
        distance: "4,2 km",
        price: "À partir de 120€/h",
        available: true,
        verified: true,
        badge: "QualiPAC",
        tags: ["Pompe à chaleur", "Clim", "VMC"],
    },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function TrouverUnProScreen() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState<"rating" | "distance">("rating");

    const filtered = PROS.filter((p) => {
        const matchCat = selectedCategory === "all" || p.category === selectedCategory;
        const matchSearch =
            search === "" ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.specialty.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchCat && matchSearch;
    });

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar style="light" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Header ── */}
                <NavHeader
                    title="Trouver un Pro"
                    subtitle="Réseau de confiance"
                    accentColor={PALETTE.purple}
                    rightAction={{ icon: "add-circle", onPress: () => router.push("/work-request/creation" as any) }}
                />

                {/* ── Hero Search ── */}
                <View style={styles.searchCard}>
                    <View style={styles.searchRow}>
                        <Ionicons name="search" size={20} color={PALETTE.dim} />
                        <TextInput
                            style={styles.searchInput}
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Plombier, fiscaliste, électricien…"
                            placeholderTextColor={PALETTE.dim}
                        />
                        {search.length > 0 && (
                            <Pressable onPress={() => setSearch("")}>
                                <Ionicons name="close-circle" size={18} color={PALETTE.dim} />
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.searchMeta}>
                        <Ionicons name="location-outline" size={14} color={PALETTE.purple} />
                        <Text style={styles.searchMetaText}>Paris · 15 km</Text>
                        <View style={styles.dot} />
                        <Text style={styles.searchMetaText}>{filtered.length} professionnels</Text>
                    </View>
                </View>

                {/* ── Categories ── */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesRow}
                    style={styles.categoriesScroll}
                >
                    {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                            <Pressable
                                key={cat.id}
                                style={[styles.catChip, active && styles.catChipActive]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                <Ionicons
                                    name={cat.icon as any}
                                    size={14}
                                    color={active ? "#fff" : PALETTE.dim}
                                />
                                <Text style={[styles.catChipText, active && styles.catChipTextActive]}>
                                    {cat.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* ── Sort row ── */}
                <View style={styles.sortRow}>
                    <Text style={styles.resultsCount}>{filtered.length} résultats</Text>
                    <View style={styles.sortBtns}>
                        <Pressable
                            style={[styles.sortBtn, sortBy === "rating" && styles.sortBtnActive]}
                            onPress={() => setSortBy("rating")}
                        >
                            <Ionicons
                                name="star"
                                size={12}
                                color={sortBy === "rating" ? PALETTE.green : PALETTE.dim}
                            />
                            <Text style={[styles.sortBtnText, sortBy === "rating" && styles.sortBtnTextActive]}>
                                Note
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.sortBtn, sortBy === "distance" && styles.sortBtnActive]}
                            onPress={() => setSortBy("distance")}
                        >
                            <Ionicons
                                name="navigate"
                                size={12}
                                color={sortBy === "distance" ? PALETTE.green : PALETTE.dim}
                            />
                            <Text
                                style={[styles.sortBtnText, sortBy === "distance" && styles.sortBtnTextActive]}
                            >
                                Proximité
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* ── Pro Cards ── */}
                <View style={styles.proList}>
                    {filtered.map((pro) => (
                        <ProCard key={pro.id} pro={pro} />
                    ))}
                    {filtered.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={40} color={PALETTE.dim} />
                            <Text style={styles.emptyTitle}>Aucun pro trouvé</Text>
                            <Text style={styles.emptyText}>Essayez une autre catégorie ou publiez une annonce</Text>
                        </View>
                    )}
                </View>

                {/* ── CTA Banner ── */}
                <Pressable
                    style={styles.ctaBanner}
                    onPress={() => router.push("/work-request/creation" as any)}
                >
                    <View style={styles.ctaLeft}>
                        <View style={styles.ctaIconBg}>
                            <Ionicons name="megaphone" size={22} color={PALETTE.purple} />
                        </View>
                        <View>
                            <Text style={styles.ctaTitle}>Besoin d'un devis ?</Text>
                            <Text style={styles.ctaText}>Publiez votre annonce et recevez des offres</Text>
                        </View>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color={PALETTE.purple} />
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Pro Card ────────────────────────────────────────────────────────────────
function ProCard({ pro }: { pro: (typeof PROS)[0] }) {
    return (
        <Pressable style={styles.proCard}>
            {/* Avatar */}
            <View style={styles.proAvatarWrapper}>
                <View style={styles.proAvatar}>
                    <Text style={styles.proAvatarText}>
                        {pro.name.split(" ").map((n) => n[0]).join("")}
                    </Text>
                </View>
                {pro.available && <View style={styles.availableDot} />}
            </View>

            {/* Info */}
            <View style={styles.proInfo}>
                {/* Name row */}
                <View style={styles.proNameRow}>
                    <Text style={styles.proName}>{pro.name}</Text>
                    {pro.verified && (
                        <Ionicons name="checkmark-circle" size={14} color={colors.semantic.info} />
                    )}
                    {pro.badge && (
                        <View style={styles.proBadge}>
                            <Text style={styles.proBadgeText}>{pro.badge}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.proSpecialty}>{pro.specialty}</Text>

                {/* Rating + location */}
                <View style={styles.proMeta}>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={11} color="#F59E0B" />
                        <Text style={styles.ratingText}>{pro.rating}</Text>
                        <Text style={styles.reviewText}>({pro.reviews})</Text>
                    </View>
                    <View style={styles.metaSep} />
                    <Ionicons name="location-outline" size={11} color={PALETTE.dim} />
                    <Text style={styles.locationText}>{pro.distance}</Text>
                </View>

                {/* Tags */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.tagsRow}>
                        {pro.tags.map((tag) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Price + action */}
            <View style={styles.proRight}>
                <Text style={styles.proPrice}>{pro.price}</Text>
                <Pressable style={[styles.proAction, !pro.available && styles.proActionDisabled]}>
                    <Text style={styles.proActionText}>{pro.available ? "Contacter" : "Indispo."}</Text>
                </Pressable>
            </View>
        </Pressable>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.bg },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 100 },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacing.screenPadding,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
    },
    headerSuper: {
        fontSize: typography.size.xs,
        color: PALETTE.purple,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 2,
    },
    headerTitle: {
        fontSize: typography.size.h1,
        fontWeight: "700",
        color: colors.text.heading,
        letterSpacing: -0.5,
    },
    requestBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: PALETTE.green,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radii.pill,
        shadowColor: PALETTE.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
    },
    requestBtnText: { color: "#fff", fontWeight: "700", fontSize: typography.size.small },

    // Search card
    searchCard: {
        marginHorizontal: spacing.screenPadding,
        backgroundColor: PALETTE.card,
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: PALETTE.border,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: PALETTE.border,
        paddingBottom: spacing.sm,
        marginBottom: spacing.xs,
    },
    searchInput: {
        flex: 1,
        color: colors.text.heading,
        fontSize: typography.size.body,
    },
    searchMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    searchMetaText: {
        color: PALETTE.dim,
        fontSize: typography.size.xs,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: PALETTE.dim,
    },

    // Categories
    categoriesScroll: { marginBottom: spacing.sm },
    categoriesRow: {
        paddingHorizontal: spacing.screenPadding,
        gap: 8,
        paddingBottom: 4,
    },
    catChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 7,
        paddingHorizontal: 13,
        borderRadius: radii.pill,
        backgroundColor: PALETTE.card,
        borderWidth: 1,
        borderColor: PALETTE.border,
    },
    catChipActive: {
        backgroundColor: PALETTE.green,
        borderColor: PALETTE.green,
    },
    catChipText: {
        color: PALETTE.dim,
        fontSize: typography.size.small,
        fontWeight: "600",
    },
    catChipTextActive: { color: "#fff" },

    // Sort
    sortRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.screenPadding,
        marginBottom: spacing.sm,
    },
    resultsCount: {
        color: PALETTE.dim,
        fontSize: typography.size.small,
        fontWeight: "500",
    },
    sortBtns: { flexDirection: "row", gap: 6 },
    sortBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: radii.pill,
        backgroundColor: PALETTE.card,
        borderWidth: 1,
        borderColor: PALETTE.border,
    },
    sortBtnActive: { borderColor: PALETTE.green },
    sortBtnText: { color: PALETTE.dim, fontSize: typography.size.xs, fontWeight: "600" },
    sortBtnTextActive: { color: PALETTE.green },

    // Pro List
    proList: {
        paddingHorizontal: spacing.screenPadding,
        gap: 12,
        marginBottom: spacing.lg,
    },

    // Pro Card
    proCard: {
        flexDirection: "row",
        backgroundColor: PALETTE.card,
        borderRadius: radii.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: PALETTE.border,
        gap: spacing.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    proAvatarWrapper: { position: "relative", alignSelf: "flex-start" },
    proAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PALETTE.greenDim,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: PALETTE.green + "40",
    },
    proAvatarText: {
        color: PALETTE.green,
        fontWeight: "800",
        fontSize: 15,
    },
    availableDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.semantic.success,
        borderWidth: 2,
        borderColor: PALETTE.card,
    },

    proInfo: { flex: 1, gap: 3 },
    proNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        flexWrap: "wrap",
    },
    proName: {
        fontSize: typography.size.body,
        fontWeight: "700",
        color: colors.text.heading,
    },
    proBadge: {
        backgroundColor: PALETTE.purpleDim,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: radii.pill,
    },
    proBadgeText: {
        color: PALETTE.purple,
        fontSize: typography.size.xs,
        fontWeight: "700",
    },
    proSpecialty: {
        color: PALETTE.dim,
        fontSize: typography.size.xs,
        fontWeight: "500",
    },
    proMeta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
    ratingText: { color: "#F59E0B", fontSize: typography.size.xs, fontWeight: "700" },
    reviewText: { color: PALETTE.dim, fontSize: typography.size.xs },
    metaSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: PALETTE.dim },
    locationText: { color: PALETTE.dim, fontSize: typography.size.xs },

    tagsRow: { flexDirection: "row", gap: 5, marginTop: 4 },
    tag: {
        backgroundColor: PALETTE.cardElevated,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: PALETTE.border,
    },
    tagText: { color: PALETTE.dim, fontSize: 10, fontWeight: "600" },

    proRight: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        minWidth: 80,
    },
    proPrice: {
        color: colors.text.heading,
        fontSize: 10,
        fontWeight: "600",
        textAlign: "right",
    },
    proAction: {
        backgroundColor: PALETTE.green,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: radii.pill,
        shadowColor: PALETTE.green,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    proActionDisabled: {
        backgroundColor: PALETTE.cardElevated,
        shadowOpacity: 0,
        elevation: 0,
    },
    proActionText: { color: "#fff", fontSize: 11, fontWeight: "700" },

    // Empty
    emptyState: {
        alignItems: "center",
        paddingVertical: spacing.xl,
        gap: spacing.sm,
    },
    emptyTitle: {
        color: colors.text.heading,
        fontSize: typography.size.h3,
        fontWeight: "700",
    },
    emptyText: {
        color: PALETTE.dim,
        fontSize: typography.size.small,
        textAlign: "center",
    },

    // CTA Banner
    ctaBanner: {
        marginHorizontal: spacing.screenPadding,
        backgroundColor: PALETTE.card,
        borderRadius: radii.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: PALETTE.purpleDim,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    ctaLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        flex: 1,
    },
    ctaIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: PALETTE.purpleDim,
        alignItems: "center",
        justifyContent: "center",
    },
    ctaTitle: {
        color: colors.text.heading,
        fontSize: typography.size.body,
        fontWeight: "700",
    },
    ctaText: {
        color: PALETTE.dim,
        fontSize: typography.size.xs,
        marginTop: 2,
    },
});
