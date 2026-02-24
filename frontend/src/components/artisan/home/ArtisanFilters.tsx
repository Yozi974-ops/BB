import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { PALETTE } from "@/src/components/owner/home/styles";

const TAGS = [
  "Plomberie",
  "Électricité",
  "Maçonnerie",
  "Chauffage",
  "Artisanat",
  "Décoration d'intérieur",
  "Jardinerie",
];

export default function ArtisanFilters({ city, setCity, tag, setTag }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ville</Text>
      <TextInput
        style={styles.input}
        value={city}
        placeholder="Ex : Lyon"
        placeholderTextColor={PALETTE.dim}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Type de travaux</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {TAGS.map((t) => (
            <Text
              key={t}
              onPress={() => setTag(t === tag ? "" : t)}
              style={[
                styles.tag,
                tag === t && { backgroundColor: PALETTE.primary, color: "white" },
              ]}
            >
              {t}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontWeight: "600", fontSize: 14, color: PALETTE.ink },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderColor: PALETTE.line,
    borderWidth: 1,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#DDD",
    color: PALETTE.ink,
  },
});
