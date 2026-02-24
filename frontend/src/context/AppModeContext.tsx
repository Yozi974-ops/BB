import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppMode = "owner" | "artisan";

type AppModeContextValue = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
};

const STORAGE_KEY = "immio_app_mode";

const AppModeContext = createContext<AppModeContextValue | undefined>(
  undefined
);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("owner");

  useEffect(() => {
    const loadMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "owner" || stored === "artisan") {
          setModeState(stored);
        }
      } catch (err) {
        console.log("Failed to load app mode:", err);
      }
    };

    loadMode();
  }, []);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(console.log);
  };

  const toggleMode = () => {
    setMode(mode === "owner" ? "artisan" : "owner");
  };

  return (
    <AppModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(AppModeContext);
  if (!ctx) {
    throw new Error("useAppMode must be used within AppModeProvider");
  }
  return ctx;
}
