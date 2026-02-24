import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, spacing, typography, layout, radii } from "@/src/theme";
import Card from "@/src/components/shared/ui/Card";
import SectionTitle from "@/src/components/shared/ui/SectionTitle";
import { authService, User } from "@/src/services/auth";

const MENU_ITEMS = [
    {
        id: "edit_profile",
        label: "Modifier mes informations",
        icon: "person",
        route: "/(owner)/profile/edit", // A adapter selon tes routes
        color: colors.primary,
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: "notifications",
        route: "/(owner)/notifications",
        color: colors.accents.warm,
    },
    {
        id: "help",
        label: "Besoin d'aide ?",
        icon: "help-buoy",
        route: "/(settings)/help",
        color: colors.secondary,
    },
    {
        id: "terms",
        label: "Mentions légales",
        icon: "document-text",
        route: "/(settings)/terms",
        color: colors.neutral[500],
    },
];

export default function OwnerProfileScreen() {
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);
        } catch (error) {
            console.log("Failed to load user", error);
        }
    };

    const handleLogout = () => {
        Alert.alert("Déconnexion", "Voulez-vous vraiment nous quitter ?", [
            { text: "Rester", style: "cancel" },
            {
                text: "Me déconnecter",
                style: "destructive",
                onPress: async () => {
                    await authService.logout();
                    router.replace("/");
                }
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mon Compte</Text>
                </View>

                {/* Identity Card - Simple & Clean */}
                <Card variant="bubble" style={styles.profileCard}>
                    <View style={styles.profileRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.display_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?"}
                            </Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>
                                {user?.display_name || user?.username || "Utilisateur"}
                            </Text>
                            <Text style={styles.userEmail}>{user?.email || "Chargement..."}</Text>
                        </View>
                        <Pressable style={styles.editBtn}>
                            <Ionicons name="pencil" size={16} color={colors.primary} />
                        </Pressable>
                    </View>
                </Card>

                {/* Menu List */}
                <SectionTitle>Préférences</SectionTitle>
                <Card variant="bubble" padding={0} style={styles.menuCard}>
                    {MENU_ITEMS.map((item, index) => (
                        <Pressable
                            key={item.id}
                            style={({ pressed }) => [
                                styles.menuItem,
                                index !== MENU_ITEMS.length - 1 && styles.menuItemBorder,
                                pressed && styles.menuItemPressed
                            ]}
                            onPress={() => {
                                // Navigation placeholder
                                if (item.route) router.push(item.route as any);
                            }}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}>
                                {/* Hex alpha hack */}
                                <Ionicons name={item.icon as any} size={20} color={item.color} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
                        </Pressable>
                    ))}
                </Card>

                {/* Logout */}
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </Pressable>

                <Text style={styles.versionText}>Version 1.0.0 • Fait avec ❤️</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...layout.screen,
    },
    scrollContent: {
        padding: spacing.screenPadding,
        paddingBottom: spacing.xxl,
    },
    header: {
        alignItems: "center",
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    headerTitle: {
        fontSize: typography.size.h3,
        fontWeight: "800",
        color: colors.text.heading,
    },
    profileCard: {
        marginBottom: spacing.lg,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: radii.circle,
        backgroundColor: colors.neutral[100],
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text.heading,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: typography.size.h3,
        fontWeight: "700",
        color: colors.text.heading,
    },
    userEmail: {
        fontSize: typography.size.body,
        color: colors.text.muted,
    },
    editBtn: {
        width: 32,
        height: 32,
        borderRadius: radii.circle,
        backgroundColor: colors.neutral[50],
        alignItems: "center",
        justifyContent: "center",
    },
    menuCard: {
        overflow: 'hidden', // clips children
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    menuItemPressed: {
        backgroundColor: colors.neutral[50],
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: radii.circle,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    menuLabel: {
        flex: 1,
        fontSize: typography.size.body,
        fontWeight: "600",
        color: colors.text.heading,
    },
    logoutButton: {
        marginTop: spacing.xl,
        alignItems: "center",
        padding: spacing.md,
    },
    logoutText: {
        color: colors.semantic.danger,
        fontWeight: "700",
        fontSize: typography.size.body,
    },
    versionText: {
        textAlign: "center",
        color: colors.text.muted,
        fontSize: 12,
        marginTop: spacing.sm,
    },
});
