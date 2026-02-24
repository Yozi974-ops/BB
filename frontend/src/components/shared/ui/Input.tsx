import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
} from "react-native";
import { colors, radii, spacing, typography } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    style,
    onFocus,
    onBlur,
    value,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    !!error && styles.inputError,
                ]}
            >
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={18}
                        color={isFocused ? PALETTE.green : PALETTE.dim}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={PALETTE.dim}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={value}
                    selectionColor={colors.primary}
                    {...props}
                />
            </View>

            {error && <Text style={styles.errorText}>⚠ {error}</Text>}
            {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: spacing.xs,
    },
    label: {
        fontSize: typography.size.small,
        color: "#C9D1D9",
        fontWeight: "600",
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        // Fond toujours noir — pas d'alternance
        backgroundColor: "#0D1117",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.10)",
        borderRadius: radii.lg,
        paddingHorizontal: spacing.md,
        height: 52,
    },
    inputFocused: {
        // Focus : bordure violette, pas de changement de fond
        borderColor: colors.primary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: colors.semantic.danger,
    },
    icon: {
        marginRight: spacing.xs,
    },
    input: {
        flex: 1,
        fontSize: typography.size.body,
        // Texte toujours blanc
        color: "#F0F6FC",
        height: "100%",
    },
    errorText: {
        fontSize: typography.size.xs,
        color: colors.semantic.danger,
        marginLeft: 4,
        fontWeight: "500",
    },
    hintText: {
        fontSize: typography.size.xs,
        color: PALETTE.dim,
        marginLeft: 4,
    },
});

export default Input;
