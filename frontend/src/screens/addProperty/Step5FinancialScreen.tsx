import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { ScreenContainer } from "@/src/components/layout/ScreenContainer";
import { ProgressHeader } from "@/src/components/ui/ProgressHeader";
import { Text } from "@/src/components/ui/Text";
import { TextField } from "@/src/components/form/TextField";
import { WizardFooter } from "@/src/components/ui/WizardFooter";
import { Card } from "@/src/components/ui/Card";
import { colors, spacing } from "@/src/theme";
import { useAddPropertyContext } from "@/src/context/AddPropertyContext";

interface Step5Form {
  purchasePrice: string;
  monthlyRent: string;
  monthlyCharges: string;
  propertyTax: string;
  loanAmount: string;
  loanRate: string;
  loanDuration: string;
}

const parseNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const Step5FinancialScreen: React.FC = () => {
  const { property, updateFinancials, totalSteps, goToStep, saveProgress } = useAddPropertyContext();
  const financials = property.financials;

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { isValid, errors },
  } = useForm<Step5Form>({
    mode: "onChange",
    defaultValues: {
      purchasePrice: financials.purchasePrice?.toString() ?? "",
      monthlyRent: financials.monthlyRent?.toString() ?? "",
      monthlyCharges: financials.monthlyCharges?.toString() ?? "",
      propertyTax: financials.propertyTax?.toString() ?? "",
      loanAmount: financials.loan?.amount?.toString() ?? "",
      loanRate: financials.loan?.rate?.toString() ?? "",
      loanDuration: financials.loan?.durationMonths?.toString() ?? "",
    },
  });

  useEffect(() => {
    goToStep(5, { persist: false });
  }, [goToStep]);

  useEffect(() => {
    const subscription = watch((values) => {
      const data = values as Step5Form;
      updateFinancials({
        purchasePrice: parseNumber(data.purchasePrice),
        monthlyRent: parseNumber(data.monthlyRent),
        monthlyCharges: parseNumber(data.monthlyCharges),
        propertyTax: parseNumber(data.propertyTax),
        loan: {
          amount: parseNumber(data.loanAmount),
          rate: parseNumber(data.loanRate),
          durationMonths: parseNumber(data.loanDuration),
        },
      });
    });
    return () => subscription.unsubscribe();
  }, [updateFinancials, watch]);

  const onSubmit = (data: Step5Form) => {
    updateFinancials({
      purchasePrice: parseNumber(data.purchasePrice),
      monthlyRent: parseNumber(data.monthlyRent),
      monthlyCharges: parseNumber(data.monthlyCharges),
      propertyTax: parseNumber(data.propertyTax),
      loan: {
        amount: parseNumber(data.loanAmount),
        rate: parseNumber(data.loanRate),
        durationMonths: parseNumber(data.loanDuration),
      },
    });
    goToStep(6);
    router.push("/add-property/step6");
  };

  const onSaveForLater = async () => {
    const data = getValues();
    updateFinancials({
      purchasePrice: parseNumber(data.purchasePrice),
      monthlyRent: parseNumber(data.monthlyRent),
      monthlyCharges: parseNumber(data.monthlyCharges),
      propertyTax: parseNumber(data.propertyTax),
      loan: {
        amount: parseNumber(data.loanAmount),
        rate: parseNumber(data.loanRate),
        durationMonths: parseNumber(data.loanDuration),
      },
    });
    await saveProgress(5);
    router.back();
  };

  const currentValues = getValues();
  const loanFieldsProvided = Boolean(currentValues.loanAmount || currentValues.loanRate || currentValues.loanDuration);

  return (
    <ScreenContainer>
      <ProgressHeader currentStep={5} totalSteps={totalSteps} label="Informations financières" />
      <View style={styles.grid}>
        <Controller
          control={control}
          name="purchasePrice"
          rules={{ required: "Prix d’achat requis", validate: (value) => (Number(value) > 0 ? true : "Doit être positif") }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Prix d’achat (€)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.purchasePrice?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="monthlyRent"
          rules={{ required: "Revenus locatifs requis", validate: (value) => (Number(value) >= 0 ? true : "Doit être positif") }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Revenus locatifs mensuels (€)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.monthlyRent?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="monthlyCharges"
          rules={{ validate: (value) => (!value || Number(value) >= 0 ? true : "Doit être positif") }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Charges mensuelles (€)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              helperText="Charges d’entretien, syndic, assurances…"
              error={errors.monthlyCharges?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="propertyTax"
          rules={{ validate: (value) => (!value || Number(value) >= 0 ? true : "Doit être positif") }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Taxe foncière annuelle (€)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.propertyTax?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="loanAmount"
          rules={{
            validate: (value) =>
              loanFieldsProvided ? (value ? (Number(value) > 0 ? true : "Montant positif") : "Indiquez le montant emprunté") : true,
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Montant du crédit (€)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              error={errors.loanAmount?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="loanRate"
          rules={{
            validate: (value) =>
              loanFieldsProvided ? (value ? (Number(value) >= 0 ? true : "Taux positif") : "Indiquez le taux annuel") : true,
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Taux du crédit (%)"
              value={value}
              keyboardType="decimal-pad"
              onChangeText={(text) => onChange(text.replace(/[^0-9.,]/g, "").replace(",", "."))}
              error={errors.loanRate?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="loanDuration"
          rules={{
            validate: (value) =>
              loanFieldsProvided ? (value ? (Number(value) > 0 ? true : "Durée positive") : "Durée requise (en mois)") : true,
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Durée du crédit (mois)"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              helperText="Renseignez la durée restante"
              error={errors.loanDuration?.message}
            />
          )}
        />
      </View>
      <Card style={styles.metricsCard}>
        <Text variant="h3" weight="semibold">
          Rentabilité estimée
        </Text>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text variant="small" color={colors.neutral[500]}>
              Rentabilité brute
            </Text>
            <Text variant="h2" weight="semibold" color={colors.primary}>
              {financials.grossYield ? `${financials.grossYield}%` : "—"}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text variant="small" color={colors.neutral[500]}>
              Rentabilité nette
            </Text>
            <Text variant="h2" weight="semibold" color={colors.accents.success}>
              {financials.netYield ? `${financials.netYield}%` : "—"}
            </Text>
          </View>
        </View>
        <Text variant="small" color={colors.neutral[500]}>
          Les calculs sont fournis à titre indicatif. Branchez votre moteur financier pour des projections avancées.
        </Text>
      </Card>
      <WizardFooter
        onPrevious={() => {
          const data = getValues();
          updateFinancials({
            purchasePrice: parseNumber(data.purchasePrice),
            monthlyRent: parseNumber(data.monthlyRent),
            monthlyCharges: parseNumber(data.monthlyCharges),
            propertyTax: parseNumber(data.propertyTax),
            loan: {
              amount: parseNumber(data.loanAmount),
              rate: parseNumber(data.loanRate),
              durationMonths: parseNumber(data.loanDuration),
            },
          });
          router.push("/add-property/step4");
        }}
        onNext={handleSubmit(onSubmit)}
        disableNext={!isValid}
        onSaveForLater={onSaveForLater}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  metricsCard: {
    gap: spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  metric: {
    flex: 1,
    gap: spacing.xs,
  },
});

export default Step5FinancialScreen;
