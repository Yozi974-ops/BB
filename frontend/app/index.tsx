import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
// --- Mois à venir pour la box "Calendrier / Échéancier"
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const now = new Date();
const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

const upcomingMonth = {
  title: `${MONTHS_FR[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`,
  events: [
    { date: "05", title: "Loyer — Studio Bastille", kind: "Paiement" as const },
    { date: "10", title: "Échéance crédit — T2 Lille", kind: "Paiement" as const },
    { date: "18", title: "État des lieux locataire", kind: "Événement" as const },
  ],
};

/* ====== Palette (charte) ====== */
const PALETTE = {
  accent: "#CFAF65", // or
  cream:  "#EFEBD8", // crème (fond)
  green:  "#4B7F52", // vert moyen
  dark:   "#183A1D", // vert foncé
  ink:    "#0E0F10", // texte principal
  dim:    "#6C736E", // texte secondaire
  line:   "rgba(24,58,29,0.10)",
  creamSoft: "rgba(239,235,216,0.6)", // fond fondu
};

export default function Home() {
  const hasProperties = true; // false => état "aucun bien"
  const [proQuery, setProQuery] = useState("");
  const [need, setNeed] = useState<"diagnostic"|"travaux"|"fiscal"|"autre"|"">("");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
        overScrollMode="always"
      >
        {/* --- En-tête --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Mon espace</Text>
            <Text style={styles.title}>Profil</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>BG</Text></View>
        </View>

        {/* --- Bandeau Bienvenue + actions --- */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Bienvenue</Text>
          <Text style={styles.heroText}>Gérez vos biens et vos flux en toute simplicité.</Text>
          <View style={styles.quickActions}>
            <Button label="Ajouter un bien" variant="primary" onPress={() => {}} />
            <Button label="Simulation"     variant="soft"    onPress={() => {}} />
          </View>
        </View>

        {/* --- Contenu --- */}
        {!hasProperties ? (
          <View style={styles.cardsGrid}>
            <CardCTA title="Ajouter un bien" desc="Créez votre premier bien et suivez vos flux." />
            <CardCTA title="Réaliser une simulation" desc="Estimez rendement et trésorerie." />
          </View>
        ) : (
          <View style={{ width: "100%" }}>
            {/* ====== ESPACE AJOUTÉ AVANT LE GRAPHIQUE ====== */}
            <View style={{ height: 8 }} />

            {/* ===== Histogramme fondu (même fond que la page) ===== */}
            <SectionTitle>Rentrées / Sorties — année en cours</SectionTitle>
            <Chart />

            {/* ===== Tableau des biens ===== */}
            <SectionTitle>Mes biens</SectionTitle>
            <View style={styles.table}>
              <Row header><Cell>Nom</Cell><Cell>Rendement net</Cell><Cell>Diff. YTD</Cell></Row>
              {properties.map((p, i) => (
                <Row key={i}>
                  <Cell>{p.name}</Cell>
                  <Cell>{p.yield}</Cell>
                  <Cell style={{ color: p.diff.startsWith("-") ? "#C94A3A" : "#1F8F55" }}>{p.diff}</Cell>
                </Row>
              ))}
            </View>

            {/* ===== 4 boxes (2x2) au fond fondu ===== */}
            <SectionTitle>Accès rapide</SectionTitle>
            <View style={styles.grid2x2}>
              {/* Biens */}
              <TouchableOpacity style={styles.box} activeOpacity={0.9}>
                <View style={styles.boxBadge} />
                <Text style={styles.boxTitle}>Biens</Text>
                <View style={styles.thumbRow}>
                  <View style={styles.thumb} />
                  <View style={styles.thumb} />
                  <View style={styles.thumb} />
                </View>
                <View style={styles.actionRow}>
                  <Pill>Ajouter</Pill>
                  <Pill>Documents</Pill>
                  <Pill>Infos clés</Pill>
                </View>
                <Text style={styles.boxChevron}>›</Text>
              </TouchableOpacity>

              {/* Échéancier */}
              <TouchableOpacity style={styles.box} activeOpacity={0.9}>
                <View style={styles.boxBadge} />
                <Text style={styles.boxTitle}>Calendrier / Échéancier</Text>
                <Text style={styles.monthTitle}>{upcomingMonth.title}</Text>
                <View style={styles.eventList}>
                  {upcomingMonth.events.map((e, i) => (
                    <View key={i} style={styles.eventRow}>
                      <View style={[styles.dot, { backgroundColor: e.kind === "Paiement" ? PALETTE.accent : PALETTE.green }]} />
                      <Text style={styles.eventText}>{e.date} — {e.title}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.boxChevron}>›</Text>
              </TouchableOpacity>

              {/* Trouver un pro */}
              <TouchableOpacity style={styles.box} activeOpacity={0.9}>
                <View style={styles.boxBadge} />
                <Text style={styles.boxTitle}>Trouver un pro</Text>
                <TextInput
                  value={proQuery}
                  onChangeText={setProQuery}
                  placeholder="Chercher (plombier, fiscalité, etc.)"
                  placeholderTextColor={PALETTE.dim}
                  style={styles.search}
                />
                <View style={styles.mapPlaceholder}>
                  <Text style={{ color: PALETTE.dim }}>[Carte / résultats]</Text>
                </View>
                <View style={styles.quoteRow}>
                  <SmallTag>Devis #124 • En cours</SmallTag>
                  <SmallTag>Devis #118 • Accepté</SmallTag>
                </View>
                <Text style={styles.boxChevron}>›</Text>
              </TouchableOpacity>

              {/* Assistance vidéo */}
              <TouchableOpacity style={styles.box} activeOpacity={0.9}>
                <View style={styles.boxBadge} />
                <Text style={styles.boxTitle}>Assistance vidéo</Text>
                <View style={styles.needRow}>
                  {(["diagnostic","travaux","fiscal","autre"] as const).map(k => (
                    <SelectablePill key={k} selected={need===k} onPress={() => setNeed(k)}>
                      {k === "diagnostic" ? "Diagnostic" : k === "travaux" ? "Travaux" : k === "fiscal" ? "Fiscal" : "Autre"}
                    </SelectablePill>
                  ))}
                </View>
                <TextInput
                  placeholder="Décrivez votre besoin…"
                  placeholderTextColor={PALETTE.dim}
                  style={styles.textarea}
                  multiline
                />
                <Button label="Envoyer la demande" variant="primary" onPress={() => {}} />
                <Text style={styles.boxChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================== COMPOSANTS ================== */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const Button = ({
  label, onPress, variant = "primary",
}: { label: string; onPress: () => void; variant?: "primary" | "soft" | "outline" }) => {
  const base = [styles.btn];
  if (variant === "primary") base.push(styles.btnPrimary);
  if (variant === "soft") base.push(styles.btnSoft);
  if (variant === "outline") base.push(styles.btnOutline);
  const textStyle = variant === "primary" ? styles.btnTextOnDark : styles.btnTextOnLight;
  return (
    <TouchableOpacity style={base} onPress={onPress} activeOpacity={0.9}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const CardCTA = ({ title, desc }: { title: string; desc: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>+ {title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
    <View style={{ marginTop: 10 }}>
      <Button label="Continuer" variant="outline" onPress={() => {}} />
    </View>
  </View>
);

const Row = ({ header, children }: { header?: boolean; children: React.ReactNode }) => (
  <View style={[styles.row, header && styles.rowHeader]}>{children}</View>
);
const Cell = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.cell, style]}>{children}</Text>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.pill}><Text style={styles.pillText}>{children}</Text></View>
);

const SmallTag = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.smallTag}><Text style={styles.smallTagText}>{children}</Text></View>
);

const SelectablePill = ({
  children, selected, onPress,
}: { children: React.ReactNode; selected?: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.selPill, selected && styles.selPillSelected]}
    activeOpacity={0.85}
  >
    <Text style={[styles.selPillText, selected && { color: "#fff" }]}>{children}</Text>
  </TouchableOpacity>
);

/* ---- Histogramme fondu ---- */
const Chart = () => {
  const data = chartData;
  const max = Math.max(...data.map(d => Math.max(d.in, d.out)));
  return (
    <View style={styles.chartArea}>
      <View style={styles.grid}>
        {[1,2,3,4].map(i => <View key={i} style={styles.gridLine} />)}
      </View>
      <View style={styles.barsRow}>
        {data.map((d, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.barIn,  { height: (d.in  / max) * 200 + 6 }]} />
            <View style={[styles.barOut, { height: (d.out / max) * 200 + 6 }]} />
            <Text style={styles.month}>{d.m}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={[styles.dot, { backgroundColor: PALETTE.green }]} />
        <Text style={styles.legendText}>Entrées</Text>
        <View style={[styles.dot, { backgroundColor: PALETTE.accent }]} />
        <Text style={styles.legendText}>Sorties</Text>
      </View>
    </View>
  );
};

/* ================== DONNÉES DÉMO ================== */

const properties = [
  { name: "Studio Bastille", yield: "4,8 %", diff: "+320 €" },
  { name: "T2 Lille",        yield: "5,4 %", diff: "-120 €" },
];

const chartData = [
  { m: "Jan", in: 90, out: 30 }, { m: "Fév", in: 92, out: 36 },
  { m: "Mar", in: 92, out: 34 }, { m: "Avr", in: 92, out: 32 },
  { m: "Mai", in: 95, out: 28 }, { m: "Juin", in: 95, out: 30 },
  { m: "Juil", in: 95, out: 35 },{ m: "Aoû", in: 95, out: 33 },
  { m: "Sep", in: 95, out: 31 }, { m: "Oct", in: 95, out: 28 },
  { m: "Nov", in: 95, out: 30 }, { m: "Déc", in: 95, out: 34 },
];

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PALETTE.cream },
  container: { padding: 20, paddingBottom: 64 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  kicker: { color: PALETTE.dim, fontSize: 13, marginBottom: 2 },
  title: { fontSize: 28, fontWeight: "800", color: PALETTE.ink, letterSpacing: 0.2 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: PALETTE.green, justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  avatarText: { color: "#fff", fontWeight: "700" },

  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1, borderColor: PALETTE.line,
    marginBottom: 16, // ✅ espace ajouté pour ne pas toucher le graphique
  },
  heroTitle: { fontSize: 20, fontWeight: "700", color: PALETTE.ink, marginBottom: 4 },
  heroText: { color: PALETTE.dim, marginBottom: 12 },
  quickActions: { flexDirection: "row" },

  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 18, minWidth: 140, alignItems: "center", marginRight: 10 },
  btnPrimary: { backgroundColor: PALETTE.dark, shadowColor: PALETTE.dark, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  btnSoft: { backgroundColor: "#E6EFE9" },
  btnOutline: { borderWidth: 1.5, borderColor: PALETTE.green, backgroundColor: "#fff" },
  btnTextOnDark: { color: "#fff", fontWeight: "700", letterSpacing: 0.2 },
  btnTextOnLight: { color: PALETTE.ink, fontWeight: "700", letterSpacing: 0.2 },

  sectionTitle: { fontSize: 17, fontWeight: "800", color: PALETTE.ink, marginTop: 6, marginBottom: 10 },

  /* ---- Chart fondu ---- */
  chartArea: {
    backgroundColor: PALETTE.creamSoft, // ✅ fondu
    borderRadius: 18,
    padding: 4,
    marginBottom: 6,
  },
  grid: {
    position: "absolute", top: 8, left: 8, right: 8, bottom: 52,
    justifyContent: "space-between",
  },
  gridLine: { height: 1, backgroundColor: PALETTE.line },
  barsRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 240, paddingHorizontal: 6, paddingTop: 10, paddingBottom: 12 },
  barCol: { alignItems: "center", width: 28 },
  barIn:  { width: 14, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: PALETTE.green },
  barOut: { width: 14, marginTop: 8, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: PALETTE.accent },
  month: { fontSize: 11, color: PALETTE.dim, marginTop: 6 },
  legend: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  legendText: { color: PALETTE.ink, marginRight: 14 },
  dot: { width: 10, height: 10, borderRadius: 5 },

  /* ---- Table légère ---- */
  table: { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: PALETTE.line, backgroundColor: "#fff", marginBottom: 10 },
  row: { flexDirection: "row", borderTopWidth: 1, borderColor: PALETTE.line },
  rowHeader: { backgroundColor: "#F5F7F1" },
  cell: { flex: 1, textAlign: "center", paddingVertical: 12, paddingHorizontal: 10, color: PALETTE.ink, fontWeight: "600" },

  /* ---- Grid 2×2 ---- */
  grid2x2: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 14 },
  box: {
    width: "48%",
    backgroundColor: PALETTE.creamSoft, // ✅ fond fondu
    borderRadius: 18,
    padding: 14,
    borderWidth: 1, borderColor: PALETTE.line,
    position: "relative",
    overflow: "hidden",
    minHeight: 170,
  },
  boxBadge: {
    position: "absolute", top: -20, right: -20, width: 70, height: 70, borderRadius: 35,
    backgroundColor: PALETTE.cream, borderWidth: 1, borderColor: PALETTE.line,
  },
  boxTitle: { fontSize: 16, fontWeight: "800", color: PALETTE.ink, marginBottom: 8 },
  boxChevron: { position: "absolute", right: 12, bottom: 10, fontSize: 22, color: "#A7AD9F" },

  thumbRow: { flexDirection: "row", marginBottom: 8 },
  thumb: { width: 40, height: 40, borderRadius: 8, marginRight: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: PALETTE.line },

  actionRow: { flexDirection: "row", flexWrap: "wrap" },
  pill: { backgroundColor: "#fff", borderColor: PALETTE.line, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, marginRight: 8, marginTop: 6 },
  pillText: { color: PALETTE.ink, fontWeight: "700" },

  monthTitle: { color: PALETTE.dim, marginBottom: 6 },
  eventList: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: PALETTE.line, paddingVertical: 6 },
  eventRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4, paddingHorizontal: 8 },
  eventText: { color: PALETTE.ink },

  search: {
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: PALETTE.line,
    paddingVertical: 8, paddingHorizontal: 12, color: PALETTE.ink, marginBottom: 8,
  },
  mapPlaceholder: {
    height: 70, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: PALETTE.line,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  quoteRow: { flexDirection: "row", flexWrap: "wrap" },
  smallTag: { backgroundColor: "#fff", borderColor: PALETTE.line, borderWidth: 1, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, marginRight: 8, marginTop: 6 },
  smallTagText: { color: PALETTE.ink },

  needRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  selPill: { borderWidth: 1, borderColor: PALETTE.green, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, marginRight: 8, marginTop: 6, backgroundColor: "#fff" },
  selPillSelected: { backgroundColor: PALETTE.dark, borderColor: PALETTE.dark },
  selPillText: { color: PALETTE.ink, fontWeight: "700" },

  textarea: {
    backgroundColor: "#fff", borderColor: PALETTE.line, borderWidth: 1, borderRadius: 12,
    minHeight: 70, padding: 10, color: PALETTE.ink, marginBottom: 10,
  },
});
