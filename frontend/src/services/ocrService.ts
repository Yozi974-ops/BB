import type { ExtractedDocumentData } from "@/src/types/property";

interface AnalyzeDocumentInput {
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeDocument = async (file: AnalyzeDocumentInput): Promise<ExtractedDocumentData> => {
  // Replace this mock with an integration to your OCR provider (AWS Textract, Google Vision, etc.).
  await delay(1200);
  return {
    address: "123 Rue de la République, 75000 Paris",
    livingArea: 68,
    dpe: "B",
    ges: "A",
    purchasePrice: 420000,
  };
};
