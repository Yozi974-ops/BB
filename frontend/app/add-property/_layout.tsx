// app/add-property/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { AddPropertyProvider } from "@/src/context/AddPropertyContext";


export default function AddPropertyLayout() {
  return (
    <AddPropertyProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AddPropertyProvider>
  );
}
