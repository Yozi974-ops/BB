import { Redirect } from "expo-router";
import { useAppMode } from "@/src/context/AppModeContext";

export default function IndexPage() {
  const { mode } = useAppMode();
  // Always redirect to the proper layout to ensure Tabs/Footer are visible
  if (mode === "owner") {
    return <Redirect href="/(owner)" />;
  }
  // Fallback or Artisan
  return <Redirect href="/(artisan)" />;
}
