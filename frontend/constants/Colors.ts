/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { colors } from "@/src/theme";

const tintColorLight = colors.primary;
const tintColorDark = colors.secondary;

export const Colors = {
  light: {
    text: colors.text.onLight,
    background: colors.background,
    tint: tintColorLight,
    icon: colors.neutral[500],
    tabIconDefault: colors.neutral[500],
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: colors.text.onDark,
    background: colors.neutral[900], // or a specific dark background if defined
    tint: tintColorDark,
    icon: colors.neutral[400],
    tabIconDefault: colors.neutral[400],
    tabIconSelected: tintColorDark,
  },
};
