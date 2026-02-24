import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

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
  nextLabel = "Continuer",
  previousLabel = "Retour",
  disableNext,
  showPrevious = true,
  showSaveForLater = true,
  loading,
}) => {
  return (
    <View style={styles.container}>
      {/* Save for later link */}
      {showSaveForLater && (
        <Pressable onPress={onSaveForLater} style={styles.saveLater} hitSlop={8}>
          <Ionicons name="bookmark-outline" size={14} color={PALETTE.dim} />
          <Text style={styles.saveLaterText}>Reprendre plus tard</Text>
        </Pressable>
      )}

      {/* Action row */}
      <View style={styles.actionsRow}>
        {showPrevious && (
          <Pressable style={styles.prevBtn} onPress={onPrevious}>
            <Ionicons name="arrow-back" size={18} color={PALETTE.body} />
            <Text style={styles.prevText}>{previousLabel}</Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.nextBtn,
            disableNext && styles.nextBtnDisabled,
            !showPrevious && styles.nextBtnFull,
          ]}
          onPress={!disableNext ? onNext : undefined}
          disabled={disableNext}
        >
          {loading ? (
            <Text style={styles.nextText}>Chargement…</Text>
          ) : (
            <>
              <Text style={styles.nextText}>{nextLabel}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
    marginTop: spacing.lg,
  },
  saveLater: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 4,
  },
  saveLaterText: {
    color: PALETTE.dim,
    fontSize: typography.size.xs,
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: PALETTE.card,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  prevText: {
    color: colors.text.body,
    fontWeight: "600",
    fontSize: typography.size.body,
  },
  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: PALETTE.green,
    shadowColor: PALETTE.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  nextBtnFull: { flex: 1 },
  nextBtnDisabled: {
    backgroundColor: PALETTE.cardElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: typography.size.body,
  },
});

export default WizardFooter;
