import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PALETTE } from "@/src/components/owner/home/styles";
import { colors } from "@/src/theme";

export default function WorkRequestCard({ request, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.city}>{request.city}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {request.description}
      </Text>

      {request.max_budget && (
        <Text style={styles.budget}>Budget max : {request.max_budget} €</Text>
      )}

      <View style={styles.tagsContainer}>
        {request.tags?.slice(0, 3).map((tag: string) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    gap: 8,
  },
  city: { fontSize: 18, fontWeight: "700", color: colors.primary },
  description: { color: PALETTE.ink, fontSize: 14 },
  budget: { color: colors.accents.warm, fontWeight: "600" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { color: "white", fontSize: 12 },
});
