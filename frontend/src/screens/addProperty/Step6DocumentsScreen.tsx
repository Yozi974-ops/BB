import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { getDocumentAsync } from "@/src/services/documentPicker";
import { router } from "expo-router";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { ProgressHeader }  from "@/src/components/ui/ProgressHeader";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { TextField } from "@/src/components/form/TextField";
import { WizardFooter } from "@/src/components/ui/WizardFooter";
import { colors, spacing } from "@/src/theme";
import { useAddPropertyContext } from "@/src/context/AddPropertyContext";
import type { ExtractedDocumentData, PropertyDocument } from "@/src/types/property";
import { analyzeDocument } from "@/src/services/ocrService";

const parseNumericValue = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(normalized) ? normalized : undefined;
};

export const Step6DocumentsScreen: React.FC = () => {
  const { property, addDocument, updateDocument, removeDocument, totalSteps, goToStep, saveProgress } =
    useAddPropertyContext();
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    goToStep(6, { persist: false });
  }, [goToStep]);

  const handleUpload = async () => {
    try {
      setIsPicking(true);
      const result = await getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
      });
      if (result.canceled || !result.assets?.length) {
        return;
      }
      const asset = result.assets[0];
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      addDocument({
        id,
        name: asset.name ?? "Document",
        uri: asset.uri,
        status: "analyzing",
      });

      try {
        const extracted = await analyzeDocument({
          name: asset.name ?? "Document",
          uri: asset.uri,
          mimeType: asset.mimeType,
          size: asset.size,
        });
        updateDocument(id, { status: "analyzed", extractedData: extracted });
      } catch (error) {
        console.warn("OCR failure", error);
        updateDocument(id, { status: "error" });
        Alert.alert(
          "Analyse indisponible",
          "Nous n’avons pas pu analyser ce document. Réessayez plus tard ou complétez les champs manuellement.",
        );
      }
    } catch (error) {
      console.warn("Document picker error", error);
    } finally {
      setIsPicking(false);
    }
  };

  const statusLabel = useMemo(
    () => ({
      pending: { label: "En attente", color: colors.neutral[500] },
      analyzing: { label: "Analyse en cours", color: colors.semantic.info },
      analyzed: { label: "Analysé", color: colors.semantic.success },
      error: { label: "Erreur", color: colors.semantic.danger },
    }),
    [],
  );

  const handleExtractedChange = (doc: PropertyDocument, key: keyof ExtractedDocumentData, value: string) => {
    const parsedValue = key === "livingArea" || key === "purchasePrice" ? parseNumericValue(value) : value;
    updateDocument(doc.id, {
      extractedData: {
        ...doc.extractedData,
        [key]: parsedValue,
      },
    });
  };

  const onSaveForLater = async () => {
    await saveProgress(6);
    router.back();
  };

  return (
    <ScreenContainer>
      <ProgressHeader currentStep={6} totalSteps={totalSteps} label="Documents du bien" />
      <Card style={styles.infoCard}>
        <Text variant="h3" weight="semibold">
          Ajoutez vos documents clés
        </Text>
        <Text variant="body" color={colors.neutral[600]}>
          Importez vos actes, DPE, baux ou factures. Nous simulons une extraction automatique des données principales.
        </Text>
        <Button label="Uploader un document" onPress={handleUpload} loading={isPicking} />
      </Card>
      <View style={styles.list}>
        {property.documents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text variant="body" color={colors.neutral[600]}>
              Aucun document pour le moment. Ajoutez un fichier pour accélérer la saisie.
            </Text>
          </Card>
        ) : (
          property.documents.map((doc) => {
            const status = statusLabel[doc.status];
            return (
              <Card key={doc.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentTitle}>
                    <Text variant="h3" weight="semibold">
                      {doc.name}
                    </Text>
                    <Text variant="small" color={status.color}>
                      {status.label}
                    </Text>
                  </View>
                  <Button label="Supprimer" variant="ghost" onPress={() => removeDocument(doc.id)} />
                </View>
                {doc.status === "analyzed" && doc.extractedData ? (
                  <View style={styles.extractedGrid}>
                    <Text variant="body" weight="medium">
                      Données extraites (modifiables)
                    </Text>
                    <TextField
                      label="Adresse"
                      value={doc.extractedData.address ?? ""}
                      onChangeText={(text) => handleExtractedChange(doc, "address", text)}
                    />
                    <TextField
                      label="Surface (m²)"
                      value={doc.extractedData.livingArea?.toString() ?? ""}
                      onChangeText={(text) => handleExtractedChange(doc, "livingArea", text)}
                      keyboardType="numeric"
                    />
                    <TextField
                      label="Classe DPE"
                      value={doc.extractedData.dpe ?? ""}
                      onChangeText={(text) => handleExtractedChange(doc, "dpe", text)}
                    />
                    <TextField
                      label="Classe GES"
                      value={doc.extractedData.ges ?? ""}
                      onChangeText={(text) => handleExtractedChange(doc, "ges", text)}
                    />
                    <TextField
                      label="Prix d’achat estimé (€)"
                      value={doc.extractedData.purchasePrice?.toString() ?? ""}
                      onChangeText={(text) => handleExtractedChange(doc, "purchasePrice", text)}
                      keyboardType="numeric"
                    />
                  </View>
                ) : null}
              </Card>
            );
          })
        )}
      </View>
      <WizardFooter
        onPrevious={() => router.push("/add-property/step5")}
        onNext={() => {
          goToStep(7);
          router.push("/add-property/step7");
        }}
        onSaveForLater={onSaveForLater}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surfaceMuted,
  },
  documentCard: {
    gap: spacing.md,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  documentTitle: {
    gap: spacing.xs,
    flex: 1,
  },
  extractedGrid: {
    gap: spacing.sm,
  },
});

export default Step6DocumentsScreen;
