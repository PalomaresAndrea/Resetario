import axios from "axios";

/**
 * Mantén VITE_API_URL SIN /api, ej:
 *   VITE_API_URL=https://recetario-backend.azurewebsites.net
 */
const DEFAULT_ORIGIN = "https://recetario-backend.azurewebsites.net";
const RAW_ORIGIN = (import.meta?.env?.VITE_API_URL || DEFAULT_ORIGIN).trim();
const ORIGIN = RAW_ORIGIN.replace(/\/+$/, "");
const baseURL = `${ORIGIN}/api`;

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { Accept: "application/json" },
});

// Adjunta token en cada request
api.interceptors.request.use((cfg) => {
  cfg.headers = cfg.headers || {};
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// Maneja 401 globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      // Notifica al contexto para cerrar sesión/reactualizar rutas
      window.dispatchEvent(new Event("app:unauthorized"));
    }
    return Promise.reject(err);
  }
);

export default api;
