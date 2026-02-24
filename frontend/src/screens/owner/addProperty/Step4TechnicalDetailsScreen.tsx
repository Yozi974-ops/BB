import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { ScreenContainer } from "@/src/components/shared/layout/ScreenContainer";
import { ProgressHeader }  from "@/src/components/shared/ui/ProgressHeader";
import { SelectField } from "@/src/components/shared/form/SelectField";
import { TextField } from "@/src/components/shared/form/TextField";
import { WizardFooter } from "@/src/components/shared/ui/WizardFooter";
import { spacing } from "@/src/theme";
import { useAddPropertyContext } from "@/src/context/AddPropertyContext";

interface Step4Form {
  dpe: string;
  ges: string;
  isCoOwned: "yes" | "no" | "";
  condoFees: string;
  overallCondition: "excellent" | "good" | "average" | "renovate" | "";
}

const energyOptions = ["A", "B", "C", "D", "E", "F", "G"].map((grade) => ({ value: grade, label: grade }));
const conditionOptions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Bon" },
  { value: "average", label: "Moyen" },
  { value: "renovate", label: "À rénover" },
];

export const Step4TechnicalDetailsScreen: React.FC = () => {
  const { property, updateTechnicalDetails, totalSteps, goToStep, saveProgress } = useAddPropertyContext();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { isValid, errors },
  } = useForm<Step4Form>({
    mode: "onChange",
    defaultValues: {
      dpe: property.technicalDetails.dpe ?? "",
      ges: property.technicalDetails.ges ?? "",
      isCoOwned: property.technicalDetails.isCoOwned === undefined ? "" : property.technicalDetails.isCoOwned ? "yes" : "no",
      condoFees: property.technicalDetails.condoFees?.toString() ?? "",
      overallCondition: property.technicalDetails.overallCondition ?? "",
    },
  });

  const isCoOwned = watch("isCoOwned");

  useEffect(() => {
    goToStep(4, { persist: false });
  }, [goToStep]);

  const persistData = (data: Step4Form) => {
    updateTechnicalDetails({
      dpe: data.dpe || undefined,
      ges: data.ges || undefined,
      isCoOwned: data.isCoOwned === "yes" ? true : data.isCoOwned === "no" ? false : undefined,
      condoFees: data.isCoOwned === "yes" ? Number(data.condoFees) : undefined,
      overallCondition: data.overallCondition || undefined,
    });
  };

  const onSubmit = (data: Step4Form) => {
    persistData(data);
    goToStep(5);
    router.push("/add-property/step5");
  };

  const onSaveForLater = async () => {
    persistData(getValues());
    await saveProgress(4);
    router.back();
  };

  return (
    <ScreenContainer>
      <ProgressHeader currentStep={4} totalSteps={totalSteps} label="Détails techniques" />
      <View style={styles.form}>
        <Controller
          control={control}
          name="dpe"
          rules={{ required: "Classe DPE requise" }}
          render={({ field: { value, onChange } }) => (
            <SelectField label="Classe DPE" placeholder="Sélectionnez" value={value} onValueChange={onChange} options={energyOptions} error={errors.dpe?.message} />
          )}
        />
        <Controller
          control={control}
          name="ges"
          rules={{ required: "Classe GES requise" }}
          render={({ field: { value, onChange } }) => (
            <SelectField label="Classe GES" placeholder="Sélectionnez" value={value} onValueChange={onChange} options={energyOptions} error={errors.ges?.message} />
          )}
        />
        <Controller
          control={control}
          name="isCoOwned"
          rules={{ required: "Précisez si le bien est en copropriété" }}
          render={({ field: { value, onChange } }) => (
            <SelectField
              label="Copropriété"
              placeholder="Sélectionnez"
              value={value}
              onValueChange={onChange}
              options={[
                { value: "yes", label: "Oui" },
                { value: "no", label: "Non" },
              ]}
              error={errors.isCoOwned?.message}
            />
          )}
        />
        {isCoOwned === "yes" ? (
          <Controller
            control={control}
            name="condoFees"
            rules={{
              required: "Charges mensuelles requises",
              validate: (value) => (Number(value) >= 0 ? true : "Doit être positif"),
            }}
            render={({ field: { value, onChange } }) => (
              <TextField
                label="Charges de copropriété (€/mois)"
                value={value}
                keyboardType="numeric"
                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
                error={errors.condoFees?.message}
              />
            )}
          />
        ) : null}
        <Controller
          control={control}
          name="overallCondition"
          rules={{ required: "État général requis" }}
          render={({ field: { value, onChange } }) => (
            <SelectField
              label="État général"
              placeholder="Sélectionnez"
              value={value}
              onValueChange={onChange}
              options={conditionOptions}
              error={errors.overallCondition?.message}
            />
          )}
        />
      </View>
      <WizardFooter
        onPrevious={() => {
          persistData(getValues());
          router.push("/add-property/step3");
        }}
        onNext={handleSubmit(onSubmit)}
        disableNext={!isValid || (isCoOwned === "yes" && !getValues().condoFees)}
        onSaveForLater={onSaveForLater}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
});

export default Step4TechnicalDetailsScreen;
