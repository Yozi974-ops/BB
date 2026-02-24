import { StyleSheet, Platform } from "react-native";
import { colors, spacing, radii, typography } from "@/src/theme";

/* 🎨 Dark Finary Palette */
export const PALETTE = {
  bg: colors.background,
  card: colors.surface,
  cardElevated: colors.surfaceElevated,
  green: colors.secondary,      // Violet — UI primary (boutons, chips, onglets)
  purple: colors.primary,       // Violet clair — accents
  greenDim: colors.accents.purpleDim, // Violet tint (remplace ancienne teinte verte UI)
  purpleDim: colors.accents.purpleDim,
  border: colors.surfaceBorder,
  ink: colors.text.heading,
  body: colors.text.body,
  dim: colors.text.muted,
  success: colors.semantic.success,
  successDim: colors.semantic.successDim,
  danger: colors.semantic.danger,
  dangerDim: colors.semantic.dangerDim,
};

export const styles = StyleSheet.create({
  /* === Conteneur principal === */
  container: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
    backgroundColor: PALETTE.bg,
  },

  /* === Header === */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  kicker: {
    fontSize: typography.size.small,
    color: PALETTE.dim,
    fontWeight: "500",
    marginBottom: 2,
  },
  title: {
    fontSize: typography.size.h1,
    fontWeight: "700",
    color: PALETTE.ink,
    letterSpacing: -0.3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  /* === StatCard Patrimoine === */
  heroCard: {
    backgroundColor: PALETTE.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: typography.size.small,
    color: PALETTE.dim,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  heroValue: {
    fontSize: 38,
    fontWeight: "700",
    color: PALETTE.ink,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: PALETTE.successDim,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: spacing.xl,
    gap: 4,
  },
  trendText: {
    fontSize: typography.size.xs,
    fontWeight: "700",
    color: PALETTE.success,
  },

  /* === Section Title === */
  sectionTitle: {
    fontSize: typography.size.h3,
    fontWeight: "700",
    color: PALETTE.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  /* === Chart === */
  chartCard: {
    backgroundColor: PALETTE.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: spacing.md,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: typography.size.body,
    fontWeight: "700",
    color: PALETTE.ink,
  },
  chartArea: {
    borderRadius: radii.md,
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 32,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  gridLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 160,
    paddingBottom: 0,
  },
  barCol: {
    alignItems: "center",
    flex: 1,
    gap: 2,
  },
  barGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 2,
  },
  barIn: {
    width: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.semantic.success, // 🟢 Revenus — vert sémantique conservé
  },
  barOut: {
    width: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: PALETTE.purple,
  },
  month: {
    fontSize: 9,
    color: PALETTE.dim,
    marginTop: 6,
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: PALETTE.dim,
    fontSize: typography.size.small,
    fontWeight: "500",
  },

  /* === PropertiesTable === */
  table: {
    backgroundColor: PALETTE.card,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: spacing.md,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PALETTE.cardElevated,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  tableHeaderCell: {
    flex: 1,
    color: PALETTE.dim,
    fontSize: typography.size.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: PALETTE.border,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: PALETTE.body,
    fontSize: typography.size.small,
    fontWeight: "500",
  },

  /* === Bento Grid (2×2) === */
  grid2x2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  box: {
    width: "48%",
    backgroundColor: PALETTE.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: PALETTE.border,
    minHeight: 180,
    overflow: "hidden",
    position: "relative",
  },
  boxAccentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  boxIconBg: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  boxTitle: {
    fontSize: typography.size.body,
    fontWeight: "700",
    color: PALETTE.ink,
    marginBottom: spacing.xs,
  },
  boxChevron: {
    position: "absolute",
    right: 12,
    bottom: 12,
  },

  // Calendar box
  monthTitle: {
    color: PALETTE.dim,
    fontSize: typography.size.xs,
    fontWeight: "600",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  eventList: { gap: 4 },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eventText: {
    color: PALETTE.body,
    fontSize: typography.size.xs,
    flex: 1,
  },

  // Pro search box
  search: {
    backgroundColor: PALETTE.cardElevated,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: PALETTE.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: PALETTE.ink,
    fontSize: typography.size.small,
    marginBottom: spacing.xs,
  },
  mapPlaceholder: {
    height: 60,
    borderRadius: radii.sm,
    backgroundColor: PALETTE.cardElevated,
    borderWidth: 1,
    borderColor: PALETTE.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  quoteRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  smallTag: {
    backgroundColor: PALETTE.cardElevated,
    borderColor: PALETTE.border,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: radii.pill,
  },
  smallTagText: {
    color: PALETTE.dim,
    fontSize: typography.size.xs,
    fontWeight: "500",
  },

  // Video assist
  needRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 },
  selPill: {
    borderWidth: 1,
    borderColor: PALETTE.border,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    backgroundColor: PALETTE.cardElevated,
  },
  selPillSelected: {
    backgroundColor: PALETTE.purple,
    borderColor: PALETTE.purple,
  },
  selPillText: { color: PALETTE.dim, fontWeight: "600", fontSize: typography.size.xs },
  selPillTextSelected: { color: "#fff" },
  textarea: {
    backgroundColor: PALETTE.cardElevated,
    borderColor: PALETTE.border,
    borderWidth: 1,
    borderRadius: radii.sm,
    minHeight: 50,
    padding: 8,
    color: PALETTE.ink,
    fontSize: typography.size.small,
    marginBottom: 8,
  },

  // Thumb placeholders (properties)
  thumbRow: { flexDirection: "row", gap: 4, marginBottom: spacing.xs },
  thumb: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: PALETTE.cardElevated,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  pill: {
    backgroundColor: PALETTE.cardElevated,
    borderColor: PALETTE.border,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  pillText: { color: PALETTE.body, fontWeight: "600", fontSize: typography.size.xs },

  /* === Feed === */
  feedCard: {
    backgroundColor: PALETTE.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: PALETTE.border,
    overflow: "hidden",
  },
  feedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  feedDivider: {
    height: 1,
    backgroundColor: PALETTE.border,
    marginHorizontal: spacing.md,
  },
  feedIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  feedContent: { flex: 1 },
  feedTitle: {
    fontWeight: "600",
    color: PALETTE.body,
    fontSize: typography.size.small,
    marginBottom: 2,
  },
  feedTime: {
    color: PALETTE.dim,
    fontSize: typography.size.xs,
  },
});
