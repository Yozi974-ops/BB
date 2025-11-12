import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { colors, spacing } from "@/src/theme";
import BackButton from "@/src/components/navigation/BackButton";
import { fetchProperties } from "@/src/services/propertyService";

type PropertyItem = {
  id: number | string;
  title: string;
  address?: string;
  purchase_price?: number;
  gross_yield?: number;
  net_yield?: number;
};

const ProfilePropertiesScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (e: any) {
        setError("Impossible de charger vos biens.");
        console.log("fetchProperties error", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ScreenContainer showProfileButton={false}>
      <BackButton />
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Mes biens immobiliers
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Retrouvez tous les biens enregistrés avec Immio.
        </Text>
      </View>

      {loading && <ActivityIndicator />}

      {error && !loading && (
        <Text variant="body" color={colors.error ?? "red"}>
          {error}
        </Text>
      )}

      {!loading && !error && properties.length === 0 && (
        <Text variant="body" color={colors.neutral[600]}>
          Vous n’avez pas encore ajouté de bien.
        </Text>
      )}

      <FlatList
        data={properties}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <Card>
            <Text variant="h3" weight="semibold">
              {item.title || "Bien sans titre"}
            </Text>
            {item.address && (
              <Text variant="small" color={colors.neutral[600]}>
                {item.address}
              </Text>
            )}
            <View style={{ marginTop: spacing.xs, gap: 2 }}>
              {item.purchase_price && (
                <Text variant="small">
                  Prix d’achat :{" "}
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(item.purchase_price)}
                </Text>
              )}
              {item.gross_yield && (
                <Text variant="small">
                  Rentabilité brute : {item.gross_yield}%
                </Text>
              )}
              {item.net_yield && (
                <Text variant="small">
                  Rentabilité nette : {item.net_yield}%
                </Text>
              )}
            </View>
            <Button
              label="Voir le détail"
              variant="ghost"
              onPress={() => {}}
            />
          </Card>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
});

export default ProfilePropertiesScreen;
