// src/services/usuarioService.js
import api from "./api";

/** Registro
 * payload: { nombre, apellidoPaterno, apellidoMaterno?, correo, contraseña }
 */
export async function registrarUsuario(payload) {
  const fullName = `${payload.nombre} ${payload.apellidoPaterno}${
    payload.apellidoMaterno ? " " + payload.apellidoMaterno : ""
  }`.trim();

  const body = { name: fullName, email: payload.correo, password: payload.contraseña };
  const { data } = await api.post("/auth/register", body);
  return data;
}

/** Verificar OTP */
export async function verificarOTP(email, code) {
  const { data } = await api.post("/auth/verify-otp", { email, code });
  return data;
}

/** Reenviar OTP */
export async function reenviarOTP(email) {
  const { data } = await api.post("/auth/resend-otp", { email });
  return data;
}

/** Login */
export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.user));
  return { token: data.token, user: data.user };
}

/** /me (requiere Bearer token) */
export async function me() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const { data } = await api.get("/auth/me");
    return data?.user ?? null;
  } catch {
    return null;
  }
}
