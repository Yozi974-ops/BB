import React from "react";
import { View, Text, StyleSheet } from "react-native";


type ProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
  label?: string; // compat ancien code
  title?: string; // nouvelle prop possible
};

const ProgressHeaderComponent: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  label,
  title,
}) => {
  const safeTotal = totalSteps > 0 ? totalSteps : 1;
  const clampedStep = Math.min(Math.max(currentStep, 1), safeTotal);
  const progressPercent = (clampedStep / safeTotal) * 100;
  const headerTitle = title ?? label;

  return (
    <View style={styles.container}>
      {headerTitle && <Text style={styles.title}>{headerTitle}</Text>}

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${progressPercent}%` }, // string -> safe
          ]}
        />
      </View>

      <Text style={styles.stepText}>
        Étape {clampedStep} / {safeTotal}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#EFEBD8",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1831AD",
    marginBottom: 8,
  },
  barBackground: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D3CCB5",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#4B7F52",
  },
  stepText: {
    marginTop: 4,
    fontSize: 12,
    color: "#1831AD",
  },
});

export const ProgressHeader = ProgressHeaderComponent;
export default ProgressHeaderComponent;
