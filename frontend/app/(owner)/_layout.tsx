import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";

import { colors, spacing, shadows } from "@/src/theme";

export default function OwnerLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.neutral[200],
                tabBarLabelStyle: styles.tabLabel,
                tabBarItemStyle: styles.tabItem,
                tabBarBackground: () => <View style={styles.tabBarBg} />,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    title: "Carte",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "map" : "map-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="action_add_property"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/add-property");
                    },
                })}
                options={{
                    title: "Ajouter",
                    tabBarIcon: () => (
                        <View style={styles.centerButton}>
                            <Ionicons name="add" size={28} color="#fff" />
                        </View>
                    ),
                    tabBarLabel: () => null,
                }}
            />

            <Tabs.Screen
                name="action_work_request"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/(owner)/travaux" as any);
                    },
                })}
                options={{
                    title: "Travaux",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "construct" : "construct-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            {/* — Routes sans tab bar visible — */}
            <Tabs.Screen
                name="trouver-un-pro"
                options={{
                    title: "Trouver un Pro",
                    tabBarItemStyle: { display: "none" },
                }}
            />
            <Tabs.Screen
                name="properties"
                options={{
                    title: "Mes Biens",
                    tabBarItemStyle: { display: "none" },
                }}
            />
            <Tabs.Screen
                name="property/[id]"
                options={{
                    title: "Détail du bien",
                    tabBarItemStyle: { display: "none" },
                    tabBarStyle: { display: "none" },
                }}
            />
            <Tabs.Screen
                name="echeancier"
                options={{ title: "Échéancier", tabBarItemStyle: { display: "none" }, tabBarStyle: { display: "none" } }}
            />
            <Tabs.Screen
                name="assistance-video"
                options={{ title: "Assistance Vidéo", tabBarItemStyle: { display: "none" }, tabBarStyle: { display: "none" } }}
            />
            <Tabs.Screen
                name="video-call"
                options={{ title: "Visio", tabBarItemStyle: { display: "none" }, tabBarStyle: { display: "none" }, headerShown: false }}
            />
            <Tabs.Screen
                name="cashflow"
                options={{ title: "Cash Flow", tabBarItemStyle: { display: "none" }, tabBarStyle: { display: "none" } }}
            />
            <Tabs.Screen
                name="travaux"
                options={{ title: "Mes Travaux", tabBarItemStyle: { display: "none" } }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "transparent",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.07)",
        elevation: 0,
        shadowOpacity: 0,
        height: Platform.OS === "ios" ? 88 : 62,
        paddingBottom: Platform.OS === "ios" ? 28 : 8,
        paddingTop: 8,
    },
    tabBarBg: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 2,
    },
    tabItem: {},
    centerButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
});
