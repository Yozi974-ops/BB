import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import ScreenContainer from "@/src/components/shared/layout/ScreenContainer";
import { api } from "@/src/services/api";
import WorkRequestCard from "@/src/components/artisan/workRequest/WorkRequestCard";
import ArtisanFilters from "@/src/components/artisan/home/ArtisanFilters";
import { PALETTE } from "@/src/components/owner/home/styles";
import { colors } from "@/src/theme";
import { Text } from "@/src/components/shared/ui/Text";
import { router } from "expo-router";
import HomeHeader from "@/src/components/owner/home/HomeHeader";

export default function ArtisanHomeScreen() {
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
      setRequests(response.data.results ?? []);
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
    <ScreenContainer title="Annonces disponibles" showProfileButton>
      <View style={styles.container}>
        <HomeHeader />
        {/* Filtres artisan */}
        <ArtisanFilters city={city} setCity={setCity} tag={tag} setTag={setTag} />

        {/* Loader */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : requests.length === 0 ? (
          <Text style={styles.noResults}>Aucune annonce trouvée.</Text>
        ) : (
          <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
            {requests.map((req: any) => (
              <WorkRequestCard
                key={req.id}
                request={req}
                onPress={() => router.push(`/artisan/work-request/${req.id}`)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  noResults: {
    textAlign: "center",
    color: PALETTE.dim,
    fontSize: 15,
    marginTop: 20,
  },
});
