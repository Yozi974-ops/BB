import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type {
  AddPropertyDraftState,
  Financials,
  PropertyDocument,
  PropertyDraft,
  PropertyType,
  PropertyUsage,
  TechnicalDetails,
  MainCharacteristics,
  Location,
} from "@/src/types/property";
import {
  clearDraft as clearDraftService,
  loadDraft as loadDraftService,
  saveDraft as saveDraftService,
  saveProperty as savePropertyService,
} from "@/src/services/propertyService";

const TOTAL_STEPS = 7;

const createInitialProperty = (): PropertyDraft => ({
  location: { address: "" },
  mainCharacteristics: {},
  technicalDetails: {},
  financials: { loan: {} },
  documents: [],
});

interface AddPropertyContextValue {
  property: PropertyDraft;
  currentStep: number;
  totalSteps: number;
  isRestoring: boolean;
  hasDraft: boolean;
  setTypeAndUsage: (payload: { type: PropertyType; usage: PropertyUsage }) => void;
  updateLocation: (location: Location) => void;
  updateMainCharacteristics: (payload: MainCharacteristics) => void;
  updateTechnicalDetails: (payload: TechnicalDetails) => void;
  updateFinancials: (payload: Partial<Financials>) => void;
  addDocument: (document: PropertyDocument) => void;
  updateDocument: (documentId: string, patch: Partial<PropertyDocument>) => void;
  removeDocument: (documentId: string) => void;
  goToStep: (step: number, options?: { persist?: boolean }) => void;
  saveProgress: (step?: number) => Promise<void>;
  clearDraft: () => Promise<void>;
  saveProperty: () => Promise<void>;
}

const AddPropertyContext = createContext<AddPropertyContextValue | undefined>(undefined);

const calculateFinancialMetrics = (financials: Financials): Pick<Financials, "grossYield" | "netYield"> => {
  const { purchasePrice, monthlyRent, monthlyCharges, propertyTax, loan } = financials;
  const rent = monthlyRent ?? 0;
  const charges = monthlyCharges ?? 0;
  const tax = propertyTax ?? 0;
  const price = purchasePrice ?? 0;

  let loanMonthly = 0;
  if (loan?.amount && loan.amount > 0 && loan.rate && loan.durationMonths && loan.durationMonths > 0) {
    const rate = loan.rate / 100 / 12;
    const n = loan.durationMonths;
    if (rate === 0) {
      loanMonthly = loan.amount / n;
    } else {
      const factor = Math.pow(1 + rate, n);
      loanMonthly = (loan.amount * rate * factor) / (factor - 1);
    }
  }

  const grossYield = price > 0 && rent > 0 ? ((rent * 12) / price) * 100 : undefined;
  const netRent = rent - charges - tax / 12 - loanMonthly;
  const netYield = price > 0 && rent > 0 ? ((netRent * 12) / price) * 100 : undefined;

  return {
    grossYield: grossYield && Number.isFinite(grossYield) ? Number(grossYield.toFixed(2)) : undefined,
    netYield: netYield && Number.isFinite(netYield) ? Number(netYield.toFixed(2)) : undefined,
  };
};

export const AddPropertyProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [property, setProperty] = useState<PropertyDraft>(createInitialProperty());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const propertyRef = useRef<PropertyDraft>(createInitialProperty());

  useEffect(() => {
    propertyRef.current = property;
  }, [property]);

  const persistDraft = useCallback((propertyData: PropertyDraft, stepNumber: number) => {
    const payload: AddPropertyDraftState = {
      property: propertyData,
      step: stepNumber,
      updatedAt: new Date().toISOString(),
    };
    saveDraftService(payload).then(() => setHasDraft(true)).catch((error) => {
      console.warn("Unable to persist draft", error);
    });
  }, []);

  const applyUpdate = useCallback(
    (updater: (previous: PropertyDraft) => PropertyDraft, options?: { step?: number; persist?: boolean }) => {
      setProperty((prev) => {
        const next = updater(prev);
        propertyRef.current = next;
        if (options?.persist ?? true) {
          persistDraft(next, options?.step ?? currentStep);
        }
        return next;
      });
    },
    [currentStep, persistDraft],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const draft = await loadDraftService();
        if (draft && active) {
          setProperty(draft.property);
          propertyRef.current = draft.property;
          setCurrentStep(draft.step ?? 1);
          setHasDraft(true);
        }
      } catch (error) {
        console.warn("Unable to load draft", error);
      } finally {
        if (active) {
          setIsRestoring(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setTypeAndUsage = useCallback(
    ({ type, usage }: { type: PropertyType; usage: PropertyUsage }) => {
      applyUpdate((prev) => ({ ...prev, type, usage }));
    },
    [applyUpdate],
  );

  const updateLocation = useCallback(
    (location: Location) => {
      applyUpdate((prev) => ({ ...prev, location: { ...location } }));
    },
    [applyUpdate],
  );

  const updateMainCharacteristics = useCallback(
    (payload: MainCharacteristics) => {
      applyUpdate((prev) => ({ ...prev, mainCharacteristics: { ...prev.mainCharacteristics, ...payload } }));
    },
    [applyUpdate],
  );

  const updateTechnicalDetails = useCallback(
    (payload: TechnicalDetails) => {
      applyUpdate((prev) => ({ ...prev, technicalDetails: { ...prev.technicalDetails, ...payload } }));
    },
    [applyUpdate],
  );

  const updateFinancials = useCallback(
    (payload: Partial<Financials>) => {
      applyUpdate((prev) => {
        const merged: Financials = {
          ...prev.financials,
          ...payload,
          loan: { ...prev.financials.loan, ...payload.loan },
        };
        const metrics = calculateFinancialMetrics(merged);
        return { ...prev, financials: { ...merged, ...metrics } };
      });
    },
    [applyUpdate],
  );

  const addDocument = useCallback(
    (document: PropertyDocument) => {
      applyUpdate((prev) => ({ ...prev, documents: [...prev.documents, document] }));
    },
    [applyUpdate],
  );

  const updateDocument = useCallback(
    (documentId: string, patch: Partial<PropertyDocument>) => {
      applyUpdate((prev) => ({
        ...prev,
        documents: prev.documents.map((doc) => (doc.id === documentId ? { ...doc, ...patch } : doc)),
      }), { persist: true });
    },
    [applyUpdate],
  );

  const removeDocument = useCallback(
    (documentId: string) => {
      applyUpdate((prev) => ({
        ...prev,
        documents: prev.documents.filter((doc) => doc.id !== documentId),
      }));
    },
    [applyUpdate],
  );

  const goToStep = useCallback(
    (step: number, options?: { persist?: boolean }) => {
      setCurrentStep(step);
      if (options?.persist ?? true) {
        persistDraft(propertyRef.current, step);
      }
    },
    [persistDraft],
  );

  const saveProgress = useCallback(
    async (step?: number) => {
      const stepToPersist = step ?? currentStep;
      setCurrentStep(stepToPersist);
      setHasDraft(true);
      try {
        await saveDraftService({
          property: propertyRef.current,
          step: stepToPersist,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.warn("Unable to save draft", error);
      }
    },
    [currentStep],
  );

  const clearDraft = useCallback(async () => {
    await clearDraftService();
    const reset = createInitialProperty();
    setProperty(reset);
    propertyRef.current = reset;
    setCurrentStep(1);
    setHasDraft(false);
  }, []);

  const saveProperty = useCallback(async () => {
    await savePropertyService(propertyRef.current);
    await clearDraft();
  }, [clearDraft]);

  const value = useMemo<AddPropertyContextValue>(
    () => ({
      property,
      currentStep,
      totalSteps: TOTAL_STEPS,
      isRestoring,
      hasDraft,
      setTypeAndUsage,
      updateLocation,
      updateMainCharacteristics,
      updateTechnicalDetails,
      updateFinancials,
      addDocument,
      updateDocument,
      removeDocument,
      goToStep,
      saveProgress,
      clearDraft,
      saveProperty,
    }),
    [
      property,
      currentStep,
      isRestoring,
      hasDraft,
      setTypeAndUsage,
      updateLocation,
      updateMainCharacteristics,
      updateTechnicalDetails,
      updateFinancials,
      addDocument,
      updateDocument,
      removeDocument,
      goToStep,
      saveProgress,
      clearDraft,
      saveProperty,
    ],
  );

  return <AddPropertyContext.Provider value={value}>{children}</AddPropertyContext.Provider>;
};

export const useAddPropertyContext = (): AddPropertyContextValue => {
  const context = useContext(AddPropertyContext);
  if (!context) {
    throw new Error("useAddPropertyContext must be used within an AddPropertyProvider");
  }
  return context;
};
