import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { ProgressHeader }  from "@/src/components/ui/ProgressHeader";
import { SelectableCard } from "@/src/components/ui/SelectableCard";
import { Text } from "@/src/components/ui/Text";
import { WizardFooter } from "@/src/components/ui/WizardFooter";
import { colors, spacing } from "@/src/theme";
import { PropertyType, PropertyUsage } from "@/src/types/property";
import { useAddPropertyContext } from "@/src/context/AddPropertyContext";

interface Step1Form {
  type: PropertyType | undefined;
  usage: PropertyUsage | undefined;
}

const propertyTypes: { value: PropertyType; label: string; icon: string; description: string }[] = [
  { value: "apartment", label: "Appartement", icon: "🏢", description: "Idéal pour les investissements urbains" },
  { value: "house", label: "Maison", icon: "🏠", description: "Résidence principale ou familiale" },
  { value: "land", label: "Terrain", icon: "🌱", description: "Projet de construction ou patrimoine" },
  { value: "commercial", label: "Local", icon: "🏬", description: "Bureaux, commerces et activités" },
];

const usageOptions: { value: PropertyUsage; label: string; description: string }[] = [
  { value: "primary", label: "Résidence principale", description: "Votre logement principal" },
  { value: "secondary", label: "Résidence secondaire", description: "Maison de vacances" },
  { value: "rental", label: "Investissement locatif", description: "Bien loué ou destiné à la location" },
];

export const Step1TypeScreen: React.FC = () => {
  const { property, setTypeAndUsage, totalSteps, goToStep, saveProgress } = useAddPropertyContext();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<Step1Form>({
    mode: "onChange",
    defaultValues: {
      type: property.type,
      usage: property.usage,
    },
  });

  useEffect(() => {
    register("type", { required: "Choisissez un type" });
    register("usage", { required: "Choisissez un usage" });
  }, [register]);

  const selectedType = watch("type");
  const selectedUsage = watch("usage");

  useEffect(() => {
    goToStep(1, { persist: false });
  }, [goToStep]);

  const onSubmit = (data: Step1Form) => {
    if (!data.type || !data.usage) {
      return;
    }
    setTypeAndUsage({ type: data.type, usage: data.usage });
    goToStep(2);
    router.push("/add-property/step2");
  };

  const onSaveForLater = async () => {
    await saveProgress(1);
    router.back();
  };

  return (
    <ScreenContainer>
      <ProgressHeader currentStep={1} totalSteps={totalSteps} label="Type de bien & usage" />
      <View style={styles.section}>
        <Text variant="h3" weight="semibold">
          Quel type de bien souhaitez-vous ajouter ?
        </Text>
        <View style={styles.cardGrid}>
          {propertyTypes.map((type) => (
            <SelectableCard
              key={type.value}
              label={type.label}
              icon={type.icon}
              description={type.description}
              selected={selectedType === type.value}
              onPress={() => setValue("type", type.value, { shouldValidate: true })}
            />
          ))}
        </View>
        {errors.type ? (
          <Text variant="small" color={colors.semantic.danger}>
            {errors.type.message}
          </Text>
        ) : null}
      </View>
      <View style={styles.section}>
        <Text variant="h3" weight="semibold">
          Pour quel usage ?
        </Text>
        <View style={styles.usageGrid}>
          {usageOptions.map((usage) => (
            <SelectableCard
              key={usage.value}
              label={usage.label}
              description={usage.description}
              selected={selectedUsage === usage.value}
              onPress={() => setValue("usage", usage.value, { shouldValidate: true })}
            />
          ))}
        </View>
        {errors.usage ? (
          <Text variant="small" color={colors.semantic.danger}>
            {errors.usage.message}
          </Text>
        ) : null}
      </View>
      <WizardFooter
        showPrevious={false}
        onNext={handleSubmit(onSubmit)}
        disableNext={!isValid || !selectedType || !selectedUsage}
        onSaveForLater={onSaveForLater}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  usageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
});

export default Step1TypeScreen;
