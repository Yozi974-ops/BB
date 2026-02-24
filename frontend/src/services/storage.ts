// AsyncStorage wrapper with in-memory fallback when the native module is unavailable.

type StorageModule = {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
};

const memoryStore = new Map<string, string>();

const memoryStorage: StorageModule = {
  async setItem(key, value) {
    memoryStore.set(key, value);
  },
  async getItem(key) {
    return memoryStore.has(key) ? (memoryStore.get(key) as string) : null;
  },
  async removeItem(key) {
    memoryStore.delete(key);
  },
};

let storagePromise: Promise<StorageModule | null> | null = null;

const ensureStorage = async () => {
  if (!storagePromise) {
    const moduleId = "@react-native-async-storage/async-storage";
    storagePromise = import(moduleId)
      .then((mod) => mod?.default as StorageModule)
      .catch((error) => {
        console.warn("@react-native-async-storage/async-storage is not available; using in-memory storage.", error);
        return null;
      });
  }
  return storagePromise;
};

export const setItem = async (key: string, value: string) => {
  const storage = await ensureStorage();
  if (storage) {
    return storage.setItem(key, value);
  }
  return memoryStorage.setItem(key, value);
};

export const getItem = async (key: string) => {
  const storage = await ensureStorage();
  if (storage) {
    return storage.getItem(key);
  }
  return memoryStorage.getItem(key);
};

export const removeItem = async (key: string) => {
  const storage = await ensureStorage();
  if (storage) {
    return storage.removeItem(key);
  }
  return memoryStorage.removeItem(key);
};
