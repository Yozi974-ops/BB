import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileButton from "@/src/components/navigation/ProfileButton";
import { colors, spacing } from "@/src/theme";

type HeaderProps = {
  title?: string;
  showProfileButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, showProfileButton = true }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {title ? <Text style={styles.title}>{title}</Text> : <View />}
      {showProfileButton && <ProfileButton />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontFamily: "Montserrat-SemiBold",
    color: colors.primary,
  },
});

export default Header;
