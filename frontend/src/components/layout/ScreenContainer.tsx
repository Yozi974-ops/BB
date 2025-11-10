import React, { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/theme";

type ScreenContainerProps = PropsWithChildren<
  ViewProps & {
    scrollable?: boolean;
  }
>;

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style, scrollable = true, ...rest }) => {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, style]} {...rest}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
});

export default ScreenContainer;
