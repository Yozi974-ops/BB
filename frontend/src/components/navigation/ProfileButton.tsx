import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";

export const ProfileButton: React.FC = () => {
  const handlePress = () => {
    router.push("/profile");
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      style={styles.button}
    >
      <Ionicons
        name="person-circle-outline"
        size={30}
        color={colors.primary ?? "#1831AD"}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});

export default ProfileButton;
