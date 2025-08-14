// src/services/api.js
import axios from "axios";

/**
 * Mantén VITE_API_URL SIN /api, ej:
 *   VITE_API_URL=https://recetario-backend.azurewebsites.net
 *
 * Fallback: si no viene el env, forzamos la nube.
 */
const DEFAULT_ORIGIN = "https://recetario-backend.azurewebsites.net";
const ORIGIN = (import.meta?.env?.VITE_API_URL || DEFAULT_ORIGIN).replace(/\/+$/, "");
const baseURL = `${ORIGIN}/api`;

// (opcional debug)
// console.warn("API baseURL =>", baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    }
    return Promise.reject(err);
  }
);

export default api;
