/**
 * NavHeader – header partagé pour tous les écrans secondaires.
 * Affiche un bouton retour (router.back) + un bouton Accueil (router.replace).
 * Règle UX : toujours 1 clic max pour revenir à l'accueil.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

interface NavHeaderProps {
    title: string;
    subtitle?: string;
    accentColor?: string;
    rightAction?: { icon: any; onPress: () => void };
    showHome?: boolean;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
    title,
    subtitle,
    accentColor = PALETTE.green,
    rightAction,
    showHome = true,
}) => {
    const canGoBack = router.canGoBack?.() ?? false;

    return (
        <View style={s.container}>
            {/* Left: Back */}
            <Pressable
                style={s.iconBtn}
                onPress={() => (canGoBack ? router.back() : router.replace("/(owner)" as any))}
                hitSlop={8}
                accessibilityLabel="Retour"
                accessibilityRole="button"
            >
                <Ionicons name="arrow-back" size={20} color={PALETTE.ink} />
            </Pressable>

            {/* Center: Title */}
            <View style={s.center}>
                {subtitle && (
                    <Text style={[s.subtitle, { color: accentColor }]}>{subtitle}</Text>
                )}
                <Text style={s.title} numberOfLines={1}>{title}</Text>
            </View>

            {/* Right: Home button (always) or custom action */}
            <View style={s.rightSlot}>
                {rightAction && (
                    <Pressable style={s.iconBtn} onPress={rightAction.onPress} hitSlop={8}>
                        <Ionicons name={rightAction.icon} size={20} color={PALETTE.green} />
                    </Pressable>
                )}
                {showHome && (
                    <Pressable
                        style={s.homeBtn}
                        onPress={() => router.replace("/(owner)" as any)}
                        hitSlop={8}
                        accessibilityLabel="Accueil"
                        accessibilityRole="button"
                    >
                        <Ionicons name="home" size={16} color={PALETTE.green} />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.screenPadding,
        paddingTop: 4,
        paddingBottom: 12,
        gap: spacing.sm,
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: PALETTE.card,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: PALETTE.border,
    },
    center: { flex: 1, gap: 1 },
    subtitle: {
        fontSize: typography.size.xs,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    title: {
        fontSize: typography.size.h3,
        fontWeight: "700",
        color: "#F0F6FC",
        letterSpacing: -0.2,
    },
    rightSlot: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    homeBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: PALETTE.greenDim,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: PALETTE.green + "40",
    },
});
