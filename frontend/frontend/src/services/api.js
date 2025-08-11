import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api" });

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// AUTH
export const registerApi = (payload) => api.post("/auth/register", payload).then(r => r.data);
export const verifyOtpApi = (correo, otp) => api.post("/auth/verify-otp", { correo, otp }).then(r => r.data);
export const resendOtpApi = (correo) => api.post("/auth/resend-otp", { correo }).then(r => r.data);
export const loginApi = (correo, password) => api.post("/auth/login", { correo, password }).then(r => r.data);

export default api;
