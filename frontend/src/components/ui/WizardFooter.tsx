import React from "react";
import { View, StyleSheet } from "react-native";
import { spacing } from "@/src/theme";
import { Button } from "./Button";

type WizardFooterProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onSaveForLater?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  disableNext?: boolean;
  showPrevious?: boolean;
  showSaveForLater?: boolean;
  loading?: boolean;
};

export const WizardFooter: React.FC<WizardFooterProps> = ({
  onNext,
  onPrevious,
  onSaveForLater,
  nextLabel = "Suivant",
  previousLabel = "Précédent",
  disableNext,
  showPrevious = true,
  showSaveForLater = true,
  loading,
}) => {
  return (
    <View style={styles.container}>
      {showSaveForLater && (
        <Button
          label="Reprendre plus tard"
          variant="ghost"
          onPress={onSaveForLater}
          accessibilityHint="Sauvegarde votre progression et retourne à l’accueil"
        />
      )}
      <View style={styles.actionsRow}>
        {showPrevious && (
          <Button
            label={previousLabel}
            variant="ghost"
            onPress={onPrevious}
            style={styles.secondaryButton}
          />
        )}
        <Button label={nextLabel} onPress={onNext} disabled={disableNext} loading={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
  },
});

export default WizardFooter;
