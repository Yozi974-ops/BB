import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors, radii } from "@/src/theme";

export default function MapComponent() {
    console.log("[MapComponent Web] Rendering...");
    return (
        <View style={[styles.container, styles.center]}>
            <Text style={styles.webText}>La carte n'est disponible que sur mobile.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
        borderRadius: radii.xl,
        margin: 10,
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.neutral[100],
    },
    webText: {
        fontSize: 16,
        color: colors.text.muted,
        textAlign: "center",
    }
});
