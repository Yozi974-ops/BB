import { Platform } from "react-native";

export const colors = {
  // Brand Colors
  primary: "#9471C1",    // Brand Purple — UI primary
  secondary: "#7C5CB8",  // Deeper Purple — accent

  // Dark Mode Background Scale
  background: "#0D1117",   // Deep black
  surface: "#161B22",      // Card background
  surfaceElevated: "#1C2128", // Elevated card
  surfaceBorder: "rgba(255,255,255,0.07)", // Subtle borders

  text: {
    heading: "#F0F6FC",    // Near-white
    body: "#C9D1D9",       // Light grey
    muted: "#8B949E",      // Dim grey
    inverse: "#0D1117",    // For text on light
  },

  accents: {
    greenDim: "rgba(63, 185, 80, 0.15)",    // Green tint — charts only
    purpleDim: "rgba(148, 113, 193, 0.18)", // Purple tint bg
    warm: "#F59E0B",
    cool: "#2E94FA",
    leaf: "#68A357",   // Charts only
    berry: "#C24F6C",
  },

  semantic: {
    success: "#3FB950",
    successDim: "rgba(63, 185, 80, 0.15)",
    warning: "#D29922",
    danger: "#F85149",
    dangerDim: "rgba(248, 81, 73, 0.15)",
    info: "#58A6FF",
  },

  neutral: {
    50: "#F0F6FC",
    100: "#C9D1D9",
    200: "#8B949E",
    300: "#484F58",
    400: "#30363D",
    500: "#21262D",
    900: "#010409",
  },
};

export const typography = {
  fonts: {
    heading: Platform.select({ ios: "System", android: "Roboto" }),
    body: Platform.select({ ios: "System", android: "Roboto" }),
  },
  size: {
    hero: 34,
    h1: 28,
    h2: 22,
    h3: 18,
    body: 15,
    small: 13,
    xs: 11,
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "800",
  } as const,
  lineHeight: {
    heading: 1.2,
    body: 1.5,
  },
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
  screenPadding: 20,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
  circle: 9999,
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  floating: {
    shadowColor: "#9471C1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  none: {
    shadowColor: "transparent",
    elevation: 0,
  },
};

export const layout = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  layout,
};

export type Theme = typeof theme;
