import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { ProgressHeader }  from "@/src/components/ui/ProgressHeader";
import { Text } from "@/src/components/ui/Text";
import { TextField } from "@/src/components/form/TextField";
import { SelectField } from "@/src/components/form/SelectField";
import { WizardFooter } from "@/src/components/ui/WizardFooter";
import { spacing } from "@/src/theme";
import { useAddPropertyContext } from "@/src/context/AddPropertyContext";

interface Step3Form {
  livingArea: string;
  rooms: string;
  bedrooms: string;
  constructionYear: string;
  occupancyStatus: "occupied" | "vacant" | "";
}

const toNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Step3MainCharacteristicsScreen: React.FC = () => {
  const { property, updateMainCharacteristics, totalSteps, goToStep, saveProgress } = useAddPropertyContext();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<Step3Form>({
    mode: "onChange",
    defaultValues: {
      livingArea: property.mainCharacteristics.livingArea?.toString() ?? "",
      rooms: property.mainCharacteristics.rooms?.toString() ?? "",
      bedrooms: property.mainCharacteristics.bedrooms?.toString() ?? "",
      constructionYear: property.mainCharacteristics.constructionYear?.toString() ?? "",
      occupancyStatus: property.mainCharacteristics.occupancyStatus ?? "",
    },
  });

  useEffect(() => {
    goToStep(3, { persist: false });
  }, [goToStep]);

  const persistValues = (data: Step3Form) => {
    updateMainCharacteristics({
      livingArea: toNumber(data.livingArea),
      rooms: toNumber(data.rooms),
      bedrooms: toNumber(data.bedrooms),
      constructionYear: toNumber(data.constructionYear),
      occupancyStatus: data.occupancyStatus || undefined,
    });
  };

  const onSubmit = (data: Step3Form) => {
    persistValues(data);
    goToStep(4);
    router.push("/add-property/step4");
  };

  const onSaveForLater = async () => {
    persistValues(getValues());
    await saveProgress(3);
    router.back();
  };

  return (
    <ScreenContainer>
      <ProgressHeader currentStep={3} totalSteps={totalSteps} label="Caractéristiques principales" />
      <View style={styles.section}>
        <Text variant="h3" weight="semibold">
          Dites-nous en plus sur le bien
        </Text>
      </View>
      <View style={styles.formGrid}>
        <Controller
          control={control}
          name="livingArea"
          rules={{ required: "Surface requise", min: { value: 1, message: "Doit être supérieur à 0" } }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Surface habitable (m²)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.livingArea?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="rooms"
          rules={{ required: "Nombre de pièces requis", min: { value: 1, message: "Au moins 1 pièce" } }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Nombre de pièces"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.rooms?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="bedrooms"
          rules={{ required: "Nombre de chambres requis", min: { value: 0, message: "Valeur positive" } }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Nombre de chambres"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.bedrooms?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="constructionYear"
          rules={{
            required: "Année de construction requise",
            minLength: { value: 4, message: "Format AAAA" },
            maxLength: { value: 4, message: "Format AAAA" },
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Année de construction"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.constructionYear?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="occupancyStatus"
          rules={{ required: "Statut requis" }}
          render={({ field: { value, onChange } }) => (
            <SelectField
              label="Statut d’occupation"
              value={value}
              placeholder="Sélectionnez"
              onValueChange={onChange}
              options={[
                { value: "occupied", label: "Occupé" },
                { value: "vacant", label: "Libre" },
              ]}
              error={errors.occupancyStatus?.message}
            />
          )}
        />
      </View>
      <WizardFooter
        onPrevious={() => {
          persistValues(getValues());
          router.push("/add-property/step2");
        }}
        onNext={handleSubmit(onSubmit)}
        disableNext={!isValid}
        onSaveForLater={onSaveForLater}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  formGrid: {
    gap: spacing.md,
  },
});

export default Step3MainCharacteristicsScreen;
