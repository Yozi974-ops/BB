// app/work-request/new.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "@/src/components/shared/layout/ScreenContainer";
import { Button, SelectablePill } from "@/src/components/shared/ui";
import { PALETTE } from "@/src/components/owner/home/styles";
import { api } from "@/src/services/api";

const TAGS = [
  "Plomberie",
  "Électricité",
  "Maçonnerie",
  "Chauffage",
  "Artisanat",
  "Décoration d'intérieur",
  "Jardinerie",
];

export default function NewWorkRequestScreen() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!description.trim() || !city.trim()) {
      Alert.alert(
        "Champs obligatoires",
        "Merci de renseigner au minimum la description et la ville."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: any = {
        description: description.trim(),
        city: city.trim(),
        tags: selectedTags,
      };

      if (maxBudget.trim()) {
        payload.max_budget = Number(maxBudget.replace(",", "."));
      }

      const response = await api.post("/work-requests/", payload);

      console.log("POST /work-requests/ OK", response.status, response.data);

      Alert.alert(
        "Annonce publiée",
        "Votre demande de travaux a bien été enregistrée.",
        [
          {
            text: "OK",
            onPress: () => {
              setDescription("");
              setCity("");
              setMaxBudget("");
              setSelectedTags([]);
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Erreur",
        error?.message || "Une erreur est survenue, veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer title="Nouvelle demande" showProfileButton>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Poster une demande de travaux</Text>

        <Text style={styles.label}>
          Description <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez les travaux souhaités..."
          placeholderTextColor={PALETTE.dim}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>
          Ville <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : Lyon, Paris..."
          placeholderTextColor={PALETTE.dim}
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Budget max (optionnel)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex : 1500"
          placeholderTextColor={PALETTE.dim}
          keyboardType="numeric"
          value={maxBudget}
          onChangeText={setMaxBudget}
        />

        <Text style={styles.label}>Type de travaux (tags)</Text>
        <View style={styles.tagsContainer}>
          {TAGS.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <SelectablePill
                key={tag}
                selected={selected}
                onPress={() => toggleTag(tag)}
              >
                {tag}
              </SelectablePill>
            );
          })}
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            label={isSubmitting ? "" : "Poster l'annonce"}
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <ActivityIndicator />}
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: PALETTE.ink,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: PALETTE.ink,
    marginTop: 8,
    marginBottom: 4,
  },
  required: {
    color: "#D11A2A",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  buttonWrapper: {
    marginTop: 24,
    alignItems: "flex-start",
  },
});
