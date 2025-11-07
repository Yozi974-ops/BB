export type PropertyType = "apartment" | "house" | "land" | "commercial";
export type PropertyUsage = "primary" | "secondary" | "rental";

export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface MainCharacteristics {
  livingArea?: number;
  rooms?: number;
  bedrooms?: number;
  constructionYear?: number;
  occupancyStatus?: "occupied" | "vacant";
}

export interface TechnicalDetails {
  dpe?: string;
  ges?: string;
  isCoOwned?: boolean;
  condoFees?: number;
  overallCondition?: "excellent" | "good" | "average" | "renovate";
}

export interface LoanDetails {
  amount?: number;
  rate?: number;
  durationMonths?: number;
}

export interface Financials {
  purchasePrice?: number;
  monthlyRent?: number;
  monthlyCharges?: number;
  propertyTax?: number;
  loan?: LoanDetails;
  grossYield?: number;
  netYield?: number;
}

export type DocumentStatus = "pending" | "analyzing" | "analyzed" | "error";

export interface ExtractedDocumentData {
  address?: string;
  livingArea?: number;
  dpe?: string;
  ges?: string;
  purchasePrice?: number;
}

export interface PropertyDocument {
  id: string;
  name: string;
  uri: string;
  status: DocumentStatus;
  extractedData?: ExtractedDocumentData;
}

export interface PropertyDraft {
  type?: PropertyType;
  usage?: PropertyUsage;
  location: Location;
  mainCharacteristics: MainCharacteristics;
  technicalDetails: TechnicalDetails;
  financials: Financials;
  documents: PropertyDocument[];
}

export interface AddPropertyDraftState {
  property: PropertyDraft;
  step: number;
  updatedAt: string;
}

export interface SavePropertyResponse {
  id: string;
  createdAt: string;
}
