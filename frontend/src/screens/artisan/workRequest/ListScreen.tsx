import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import ScreenContainer from "@/src/components/shared/layout/ScreenContainer";
import { api } from "@/src/services/api";
import WorkRequestCard from "@/src/components/artisan/workRequest/WorkRequestCard";
import ArtisanFilters from "@/src/components/artisan/home/ArtisanFilters";
import { PALETTE } from "@/src/components/owner/home/styles";
import { colors } from "@/src/theme";
import { router } from "expo-router";

export default function WorkRequestsListScreen() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [city, setCity] = useState("");
  const [tag, setTag] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);

      let url = "/work-requests/";
      const params: any = {};

      if (city) params.city = city;
      if (tag) params.tag = tag;

      const response = await api.get(url, { params });
      setRequests(response.data);
    } catch (err) {
      console.log("ERROR loading work requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [city, tag]);

  return (
    <ScreenContainer title="Annonces de travaux" showProfileButton>
      <View style={styles.container}>
        <ArtisanFilters
          city={city}
          setCity={setCity}
          tag={tag}
          setTag={setTag}
        />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : requests.length === 0 ? (
          <Text style={styles.noResults}>Aucune annonce trouvée.</Text>
        ) : (
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {requests.map((req: any) => (
              <WorkRequestCard
                key={req.id}
                request={req}
                onPress={() =>
                  router.push(`/artisan/work-request/${req.id}`)
                }
              />
            ))}
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  noResults: {
    textAlign: "center",
    color: PALETTE.dim,
    fontSize: 15,
    marginTop: 20,
  },
});
