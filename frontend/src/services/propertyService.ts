import { getItem, removeItem, setItem } from "@/src/services/storage";
import type {
  AddPropertyDraftState,
  PropertyDraft,
  SavePropertyResponse,
} from "@/src/types/property";
import { api } from "./api";

const DRAFT_KEY = "add_property_draft_v1";

// Generic property type returned by the API
export interface Property {
  id: string | number;
  name?: string;
  title?: string;
  type?: string;
  address?: string;
  [key: string]: any;
}


/**
 * Gestion du brouillon en local (SecureStore / AsyncStorage)
 */
export const saveDraft = async (draft: AddPropertyDraftState): Promise<void> => {
  await setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const loadDraft = async (): Promise<AddPropertyDraftState | null> => {
  const raw = await getItem(DRAFT_KEY);
  if (!raw) return null;

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

/**
 * Mapping PropertyDraft -> payload API /properties/
 */
const mapDraftToApiPayload = (payload: PropertyDraft) => {
  return {
    title: payload.location.address || "Mon bien",

    type: payload.type,
    usage: payload.usage,

    address: payload.location.address,
    latitude: payload.location.latitude,
    longitude: payload.location.longitude,

    living_area: payload.mainCharacteristics.livingArea,
    rooms: payload.mainCharacteristics.rooms,
    bedrooms: payload.mainCharacteristics.bedrooms,
    construction_year: payload.mainCharacteristics.constructionYear,
    occupancy_status: payload.mainCharacteristics.occupancyStatus,

    dpe: payload.technicalDetails.dpe,
    ges: payload.technicalDetails.ges,
    is_co_owned: payload.technicalDetails.isCoOwned,
    condo_fees: payload.technicalDetails.condoFees,
    overall_condition: payload.technicalDetails.overallCondition,

    purchase_price: payload.financials.purchasePrice,
    monthly_rent: payload.financials.monthlyRent,
    monthly_charges: payload.financials.monthlyCharges,
    property_tax: payload.financials.propertyTax,

    loan_amount: payload.financials.loan?.amount,
    loan_rate: payload.financials.loan?.rate,
    loan_duration_months: payload.financials.loan?.durationMonths,

    gross_yield: payload.financials.grossYield,
    net_yield: payload.financials.netYield,
  };
};

/**
 * Appel réel backend : création du bien
 */
export const saveProperty = async (
  payload: PropertyDraft
): Promise<SavePropertyResponse> => {
  const body = mapDraftToApiPayload(payload);

  try {
    const response = await api.post("/properties/", body);

    console.log("API /properties/ OK", response.data);

    return {
      id: String(response.data.id),
      createdAt: response.data.created_at,
    };
  } catch (error: any) {
    console.log(
      "API /properties/ ERROR",
      error?.response?.status,
      error?.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Upload d'un document lié à un bien
 */
export const uploadPropertyDocument = async (
  propertyId: string,
  uri: string,
  name: string
) => {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name,
    type: "application/pdf", // adapte selon tes fichiers
  } as any);

  try {
    const response = await api.post(
      `/properties/${propertyId}/documents/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("API upload doc OK", response.data);
    return response.data;
  } catch (error: any) {
    console.log(
      "API upload doc ERROR",
      error?.response?.status,
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const fetchProperties = async () => {
  const response = await api.get("/properties/");
  return response.data;
};
