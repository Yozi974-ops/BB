import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const BackButton: React.FC = () => (
  <View style={styles.container}>
    <Pressable onPress={() => router.back()} hitSlop={10}>
      <Ionicons name="chevron-back" size={24} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 50,
  },
});

export default BackButton;
