export const colors = {
  primary: "#496F5D",
  secondary: "#9471C1",
  background: "#EFEBD8",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  text: {
    onLight: "#34113F",
    onDark: "#EFEBD8",
  },
  accents: {
    warm: "#F59E0B",
    data: "#9333EA",
    success: "#10B981",
  },
  neutral: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1F2937",
    900: "#0F172A",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#2E94FA",
  },
  overlay: {
    lightHover: "rgba(0, 0, 0, 0.08)",
    lightPressed: "rgba(0, 0, 0, 0.16)",
    darkHover: "rgba(255, 255, 255, 0.08)",
    darkPressed: "rgba(255, 255, 255, 0.16)",
  },
};

export const typography = {
  fonts: {
    // Replace these system fallbacks with your custom font names once the TTF files are bundled.
    heading: "System",
    headingBold: "System",
    body: "System",
    bodyMedium: "System",
  },
  size: {
    h1: 30,
    h2: 24,
    h3: 20,
    body: 16,
    small: 14,
  },
  lineHeight: {
    heading: 1.2,
    body: 1.5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
};

export type Theme = typeof theme;
