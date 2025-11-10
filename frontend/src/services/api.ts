import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.16:8000/api", // à adapter à ton réseau local
  timeout: 10000,
});
