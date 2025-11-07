import { getItem, removeItem, setItem } from "@/src/services/storage";
import type { AddPropertyDraftState, PropertyDraft, SavePropertyResponse } from "@/src/types/property";

const DRAFT_KEY = "add_property_draft_v1";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const saveDraft = async (draft: AddPropertyDraftState): Promise<void> => {
  await setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const loadDraft = async (): Promise<AddPropertyDraftState | null> => {
  const raw = await getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AddPropertyDraftState;
  } catch (error) {
    console.warn("Failed to parse draft", error);
    await removeItem(DRAFT_KEY);
    return null;
  }
};

export const clearDraft = async (): Promise<void> => {
  await removeItem(DRAFT_KEY);
};

export const saveProperty = async (payload: PropertyDraft): Promise<SavePropertyResponse> => {
  // In production, replace this stub with an actual API call to your backend:
  // await apiClient.post('/properties', payload);
  await delay(900);
  return {
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
};
