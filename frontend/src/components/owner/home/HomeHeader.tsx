import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, PALETTE } from "./styles";
import { authService, User } from "@/src/services/auth";
import { router } from "expo-router";

interface HomeHeaderProps {
  user: User | null;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  const initials =
    user?.display_name?.[0]?.toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "B";
  const name = user?.display_name || user?.username || "Benjamin";

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.kicker}>Bonjour 👋</Text>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable
          hitSlop={8}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: PALETTE.cardElevated,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: PALETTE.border,
          }}
        >
          <Ionicons name="notifications-outline" size={20} color={PALETTE.dim} />
        </Pressable>
        <Pressable style={styles.avatar} onPress={() => router.push("/(owner)/profile")}>
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      </View>
    </View>
  );
}
