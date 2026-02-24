import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ScrollView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import MapComponent from "@/src/components/owner/map/MapComponent";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

const MOCK_PROPERTIES = [
    {
        id: 1,
        name: "Studio Bastille",
        address: "Paris 11e",
        type: "Appartement",
        area: 38,
        yield: "4,8%",
        status: "Loué",
        statusColor: colors.semantic.success,
    },
    {
        id: 2,
        name: "T2 Lille",
        address: "Lille Centre",
        type: "Appartement",
        area: 55,
        yield: "5,4%",
        status: "Disponible",
        statusColor: colors.secondary,
    },
];

export default function OwnerMapScreen() {
    const [selected, setSelected] = React.useState<number | null>(null);
    const [searchFocused, setSearchFocused] = React.useState(false);

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            {/* ── Map (full bleed) ── */}
            <View style={styles.mapContainer}>
                <MapComponent />
            </View>

            {/* ── Top Search Bar Overlay ── */}
            <View style={styles.searchOverlay}>
                <Pressable style={styles.searchBar} onFocus={() => setSearchFocused(true)}>
                    <Ionicons name="search" size={18} color={PALETTE.dim} />
                    <Text style={styles.searchPlaceholder}>Rechercher une adresse…</Text>
                    <View style={styles.filterBtn}>
                        <Ionicons name="options-outline" size={16} color={PALETTE.green} />
                    </View>
                </Pressable>
            </View>

            {/* ── Stats strip ── */}
            <View style={styles.statsStrip}>
                <StatPill icon="home" label="2 biens" color={PALETTE.green} />
                <StatPill icon="trending-up" label="5,1% moy." color={colors.semantic.success} />
                <StatPill icon="cash-outline" label="1 240 k€" color={PALETTE.purple} />
                <Pressable style={styles.addBtn} onPress={() => router.push("/add-property" as any)}>
                    <Ionicons name="add" size={18} color="#fff" />
                    <Text style={styles.addBtnText}>Ajouter</Text>
                </Pressable>
            </View>

            {/* ── Property Cards carousel ── */}
            <View style={styles.cardsArea}>
                <Text style={styles.cardsTitle}>Mes biens</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsScroll}
                >
                    {MOCK_PROPERTIES.map((p) => (
                        <Pressable
                            key={p.id}
                            style={[styles.propertyCard, selected === p.id && styles.propertyCardSelected]}
                            onPress={() => setSelected(p.id === selected ? null : p.id)}
                        >
                            {/* Thumbnail placeholder */}
                            <View style={styles.cardThumb}>
                                <Ionicons name="home" size={24} color={PALETTE.green} />
                            </View>
                            <View style={styles.cardBody}>
                                <View style={styles.cardTitleRow}>
                                    <Text style={styles.cardName} numberOfLines={1}>{p.name}</Text>
                                    <View style={[styles.statusDot, { backgroundColor: p.statusColor }]} />
                                </View>
                                <Text style={styles.cardAddress}>{p.address} · {p.area}m²</Text>
                                <View style={styles.cardMeta}>
                                    <View style={styles.yieldBadge}>
                                        <Ionicons name="trending-up" size={10} color={colors.semantic.success} />
                                        <Text style={styles.yieldText}>{p.yield}</Text>
                                    </View>
                                    <Text style={[styles.statusText, { color: p.statusColor }]}>{p.status}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={PALETTE.dim} />
                        </Pressable>
                    ))}

                    {/* Add card */}
                    <Pressable style={styles.addCard} onPress={() => router.push("/add-property" as any)}>
                        <View style={styles.addCardIcon}>
                            <Ionicons name="add" size={28} color={PALETTE.green} />
                        </View>
                        <Text style={styles.addCardText}>Ajouter un bien</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

function StatPill({ icon, label, color }: { icon: any; label: string; color: string }) {
    return (
        <View style={[styles.statPill, { borderColor: color + "33" }]}>
            <Ionicons name={icon} size={12} color={color} />
            <Text style={[styles.statPillText, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: PALETTE.bg,
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },

    // Search overlay
    searchOverlay: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PALETTE.card,
        borderRadius: radii.pill,
        paddingVertical: 10,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: PALETTE.border,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    searchPlaceholder: {
        flex: 1,
        color: PALETTE.dim,
        fontSize: typography.size.body,
    },
    filterBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: PALETTE.greenDim,
        alignItems: "center",
        justifyContent: "center",
    },

    // Stats strip
    statsStrip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        flexWrap: "wrap",
    },
    statPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: radii.pill,
        backgroundColor: PALETTE.card,
        borderWidth: 1,
    },
    statPillText: {
        fontSize: typography.size.xs,
        fontWeight: "700",
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: radii.pill,
        backgroundColor: PALETTE.green,
    },
    addBtnText: {
        color: "#fff",
        fontSize: typography.size.xs,
        fontWeight: "700",
    },

    // Property cards
    cardsArea: {
        position: "absolute",
        bottom: Platform.OS === "ios" ? 90 : 70,
        left: 0,
        right: 0,
    },
    cardsTitle: {
        color: colors.text.heading,
        fontSize: typography.size.small,
        fontWeight: "700",
        paddingHorizontal: spacing.md,
        marginBottom: spacing.xs,
        textShadowColor: "rgba(0,0,0,0.8)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cardsScroll: {
        paddingHorizontal: spacing.md,
        gap: 10,
        paddingBottom: 4,
    },
    propertyCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PALETTE.card,
        borderRadius: radii.lg,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: PALETTE.border,
        width: 240,
        gap: spacing.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    propertyCardSelected: {
        borderColor: PALETTE.green,
        borderWidth: 1.5,
    },
    cardThumb: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        backgroundColor: PALETTE.greenDim,
        alignItems: "center",
        justifyContent: "center",
    },
    cardBody: { flex: 1 },
    cardTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    cardName: {
        fontSize: typography.size.small,
        fontWeight: "700",
        color: colors.text.heading,
        flex: 1,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginLeft: 4,
    },
    cardAddress: {
        fontSize: typography.size.xs,
        color: PALETTE.dim,
        marginBottom: 4,
    },
    cardMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    yieldBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: colors.semantic.successDim,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: radii.pill,
    },
    yieldText: {
        color: colors.semantic.success,
        fontSize: typography.size.xs,
        fontWeight: "700",
    },
    statusText: {
        fontSize: typography.size.xs,
        fontWeight: "600",
    },
    addCard: {
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PALETTE.card,
        borderRadius: radii.lg,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: PALETTE.border,
        borderStyle: "dashed",
        gap: spacing.xs,
        minHeight: 76,
    },
    addCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PALETTE.greenDim,
        alignItems: "center",
        justifyContent: "center",
    },
    addCardText: {
        color: PALETTE.green,
        fontSize: typography.size.xs,
        fontWeight: "700",
        textAlign: "center",
    },
});
