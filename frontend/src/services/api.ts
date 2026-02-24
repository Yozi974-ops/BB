import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: "http://192.168.1.136:8000/api", // PAS localhost si tu testes depuis ton iPhone
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("authToken"); // ou le nom que tu utilises réellement
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
