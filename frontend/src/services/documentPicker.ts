// Lightweight wrapper around expo-document-picker with graceful fallback when the native module is unavailable.

type DocumentPickerAsset = {
  name?: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
};

type DocumentPickerResult = {
  canceled: boolean;
  assets?: DocumentPickerAsset[];
};

type DocumentPickerOptions = {
  type?: string[];
  multiple?: boolean;
};

let modulePromise:
  | Promise<{ getDocumentAsync?: (options?: DocumentPickerOptions) => Promise<DocumentPickerResult> } | null>
  | null = null;

const ensureModule = async () => {
  if (!modulePromise) {
    const moduleId = "expo-document-picker";
    modulePromise = import(moduleId)
      .then((mod) => mod as { getDocumentAsync?: (options?: DocumentPickerOptions) => Promise<DocumentPickerResult> })
      .catch((error) => {
        console.warn("expo-document-picker is not available; falling back to a no-op implementation.", error);
        return null;
      });
  }
  return modulePromise;
};

export const getDocumentAsync = async (options?: DocumentPickerOptions): Promise<DocumentPickerResult> => {
  const mod = await ensureModule();
  if (mod?.getDocumentAsync) {
    return mod.getDocumentAsync(options);
  }
  return { canceled: true, assets: [] };
};

export type { DocumentPickerAsset, DocumentPickerOptions, DocumentPickerResult };
