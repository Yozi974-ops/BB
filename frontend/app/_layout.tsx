import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AddPropertyProvider } from "@/src/context/AddPropertyContext";
import { colors } from "@/src/theme";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if already hidden
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <AddPropertyProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="add-property/index" />
        <Stack.Screen name="add-property/step1" />
        <Stack.Screen name="add-property/step2" />
        <Stack.Screen name="add-property/step3" />
        <Stack.Screen name="add-property/step4" />
        <Stack.Screen name="add-property/step5" />
        <Stack.Screen name="add-property/step6" />
        <Stack.Screen name="add-property/step7" />
        <Stack.Screen name="add-property/success" />
      </Stack>
    </AddPropertyProvider>
  );
}
