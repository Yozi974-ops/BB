import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import ScreenContainer from "@/src/components/shared/layout/ScreenContainer";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/src/services/api";
import { PALETTE } from "@/src/components/owner/home/styles";
import { Text } from "@/src/components/shared/ui/Text";
import { Button } from "@/src/components/shared/ui/Button";

export default function WorkRequestDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");

  const loadDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/work-requests/${id}/`);
      setRequest(response.data);
    } catch (err) {
      console.log("Error loading request details:", err);
      Alert.alert("Erreur", "Impossible de charger l’annonce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleProposeOffer = async () => {
    if (!request) return;

    if (!proposedPrice.trim()) {
      Alert.alert("Informations manquantes", "Merci d’indiquer un prix proposé.");
      return;
    }

    try {
      const payload = {
        work_request: request.id,
        message: message.trim() || "",
        proposed_price: Number(proposedPrice.replace(",", ".")),
      };

      console.log("POST /work-offers/", payload);

      const response = await api.post("/work-offers/", payload);

      console.log("Offre créée:", response.data);
      Alert.alert(
        "Offre envoyée",
        "Votre proposition a été transmise au propriétaire."
      );

      // Optionnel : on vide le formulaire
      setMessage("");
      setProposedPrice("");
    } catch (err: any) {
      console.log("Error creating offer:", err?.response || err);
      Alert.alert(
        "Erreur",
        "Impossible d’envoyer votre offre pour le moment."
      );
    }
  };

  if (loading || !request) {
    return (
      <ScreenContainer title="Détails" showProfileButton>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PALETTE.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Détails de la demande" showProfileButton>
      <View style={styles.container}>
        {/* Infos de l’annonce */}
        <Text variant="h2" weight="bold" style={styles.city}>
          {request.city}
        </Text>
        <Text variant="body" style={styles.description}>
          {request.description}
        </Text>

        {request.max_budget && (
          <Text variant="body" weight="semibold" style={styles.budget}>
            Budget max : {request.max_budget} €
          </Text>
        )}

        <View style={styles.tagsContainer}>
          {request.tags?.map((tag: string) => (
            <View key={tag} style={styles.tag}>
              <Text variant="small" weight="semibold" style={styles.tagText}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Formulaire d'offre artisan */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold">
            Proposer vos services
          </Text>

          <Text variant="small" color={PALETTE.dim} style={{ marginTop: 4 }}>
            Indiquez un prix et un message à destination du propriétaire.
          </Text>

          <Text variant="body" weight="semibold" style={styles.fieldLabel}>
            Prix proposé (€)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : 1200"
            keyboardType="numeric"
            value={proposedPrice}
            onChangeText={setProposedPrice}
            placeholderTextColor={PALETTE.dim}
          />

          <Text variant="body" weight="semibold" style={styles.fieldLabel}>
            Message (optionnel)
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Présentez-vous, précisez vos disponibilités, etc."
            multiline
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={PALETTE.dim}
          />

          <View style={{ marginTop: 16 }}>
            <Button
              label="Proposer mes services"
              variant="primary"
              onPress={handleProposeOffer}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    gap: 12,
  },
  city: {
    color: PALETTE.primary,
    marginBottom: 4,
  },
  description: {
    color: PALETTE.ink,
    marginBottom: 8,
  },
  budget: {
    color: PALETTE.accent,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: PALETTE.primary,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: "white",
  },
  section: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: PALETTE.line,
  },
  fieldLabel: {
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.line,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
