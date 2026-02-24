import { Stack } from "expo-router";
import { AppModeProvider } from "@/src/context/AppModeContext";

export default function RootLayout() {
  return (
    <AppModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
      </Stack>
    </AppModeProvider>
  );
}
