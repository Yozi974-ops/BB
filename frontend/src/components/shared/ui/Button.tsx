import React from "react";
import {
  Text,
  TouchableOpacity, // Using TouchableOpacity for simplicity with RN, or Pressable for more control
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
  Animated,
} from "react-native";
import { colors, radii, spacing, typography, shadows } from "@/src/theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
}) => {
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 100,
    }).start();
  };

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radii.pill,
      opacity: disabled ? 0.6 : 1,
    };

    // Size
    switch (size) {
      case "sm":
        base.paddingVertical = 6;
        base.paddingHorizontal = spacing.md;
        base.minHeight = 32;
        break;
      case "lg":
        base.paddingVertical = 16;
        base.paddingHorizontal = spacing.xl;
        base.minHeight = 56;
        break;
      case "md":
      default:
        base.paddingVertical = 12;
        base.paddingHorizontal = spacing.lg;
        base.minHeight = 48;
        break;
    }

    // Variant
    switch (variant) {
      case "secondary":
        base.backgroundColor = colors.secondary;
        // @ts-ignore
        base.shadowColor = shadows.card.shadowColor;
        base.shadowOffset = shadows.card.shadowOffset;
        base.shadowOpacity = shadows.card.shadowOpacity;
        base.shadowRadius = shadows.card.shadowRadius;
        base.elevation = shadows.card.elevation;
        break;
      case "outline":
        base.backgroundColor = "transparent";
        base.borderWidth = 1.5;
        base.borderColor = colors.primary;
        break;
      case "ghost":
        base.backgroundColor = "transparent";
        break;
      case "danger":
        base.backgroundColor = colors.semantic.danger;
        break;
      case "primary":
      default:
        base.backgroundColor = colors.primary;
        // @ts-ignore
        base.shadowColor = shadows.card.shadowColor;
        base.shadowOffset = shadows.card.shadowOffset;
        base.shadowOpacity = shadows.card.shadowOpacity;
        base.shadowRadius = shadows.card.shadowRadius;
        base.elevation = shadows.card.elevation;
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
      fontSize: size === "sm" ? 14 : size === "lg" ? 18 : 16,
    };

    switch (variant) {
      case "outline":
        base.color = colors.primary;
        break;
      case "ghost":
        base.color = colors.primary;
        break;
      case "secondary":
      case "danger":
      case "primary":
      default:
        base.color = "#fff";
        break;
    }

    return base;
  };

  return (
    <Pressable
      onPress={!disabled && !isLoading ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={[getContainerStyle(), { transform: [{ scale: animatedScale }] }]}>
        {isLoading ? (
          <ActivityIndicator color={variant === "outline" ? colors.primary : "#fff"} />
        ) : (
          <>
            {leftIcon}
            <Text style={[getTextStyle(), leftIcon ? { marginLeft: 8 } : undefined, rightIcon ? { marginRight: 8 } : undefined]}>
              {title}
            </Text>
            {rightIcon}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default Button;
