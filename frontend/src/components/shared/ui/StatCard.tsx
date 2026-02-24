import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, typography, spacing, radii } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
    label: string;
    value: string;
    trend?: number;       // e.g. 2.4 for +2.4%
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    accentColor?: string;
    style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    trend,
    subtitle,
    icon,
    accentColor = colors.primary,
    style,
}) => {
    const isPositive = trend === undefined ? true : trend >= 0;
    const trendColor = isPositive ? colors.semantic.success : colors.semantic.danger;
    const trendBg = isPositive ? colors.semantic.successDim : colors.semantic.dangerDim;

    return (
        <View style={[styles.container, style]}>
            {/* Label row */}
            <View style={styles.labelRow}>
                {icon && (
                    <View style={[styles.iconBg, { backgroundColor: accentColor + "22" }]}>
                        <Ionicons name={icon} size={16} color={accentColor} />
                    </View>
                )}
                <Text style={styles.label}>{label}</Text>
            </View>

            {/* Main value */}
            <Text style={styles.value}>{value}</Text>

            {/* Trend badge */}
            {trend !== undefined && (
                <View style={[styles.trendBadge, { backgroundColor: trendBg }]}>
                    <Ionicons
                        name={isPositive ? "trending-up" : "trending-down"}
                        size={12}
                        color={trendColor}
                    />
                    <Text style={[styles.trendText, { color: trendColor }]}>
                        {isPositive ? "+" : ""}{trend.toFixed(1)}% ce mois
                    </Text>
                </View>
            )}

            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    iconBg: {
        width: 28,
        height: 28,
        borderRadius: radii.sm,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.xs,
    },
    label: {
        fontSize: typography.size.small,
        color: colors.text.muted,
        fontWeight: "500",
        letterSpacing: 0.3,
        textTransform: "uppercase",
    },
    value: {
        fontSize: typography.size.hero,
        fontWeight: "700",
        color: colors.text.heading,
        letterSpacing: -0.5,
        marginBottom: spacing.xs,
    },
    trendBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: radii.pill,
        gap: 4,
    },
    trendText: {
        fontSize: typography.size.xs,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: typography.size.small,
        color: colors.text.muted,
        marginTop: spacing.xs,
    },
});

export default StatCard;
