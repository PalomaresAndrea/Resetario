// src/services/usuarioService.js
import api from "./api";

/** Registro
 * payload: { nombre, apellidoPaterno, apellidoMaterno?, correo, contraseña }
 * Respuesta normalizada: { token, usuario }
 */
export async function registrarUsuario(payload) {
  const fullName = `${payload.nombre} ${payload.apellidoPaterno}${
    payload.apellidoMaterno ? " " + payload.apellidoMaterno : ""
  }`.trim();

  const body = { name: fullName, email: payload.correo, password: payload.contraseña };
  const { data } = await api.post("/auth/register", body);
  // El backend devuelve { token, user: {...} }
  const token = data?.token;
  const usuario = data?.user;

  if (token && usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }
  return { token, usuario };
}

/** Verificar OTP (si tu backend expone estas rutas) */
export async function verificarOTP(email, code) {
  const { data } = await api.post("/auth/verify-otp", { email, code });
  // Estandariza por si el backend también devuelve token/usuario al verificar
  if (data?.token && data?.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));
  }
  return data;
}

/** Reenviar OTP (si tu backend expone esta ruta) */
export async function reenviarOTP(email) {
  const { data } = await api.post("/auth/resend-otp", { email });
  return data;
}

/** Login
 * Respuesta normalizada: { token, usuario }
 * (tu LoginForm espera `res.usuario`)
 */
export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  const token = data?.token;
  const usuario = data?.user;

  if (token && usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }
  return { token, usuario };
}

/** /me (requiere Bearer token)
 * Devuelve el usuario actual o null.
 * Soporta dos formas de respuesta del backend:
 *  - { user: {...} }
 *  - { id, email, name }
 */
export async function me() {
  const t = localStorage.getItem("token");
  if (!t) return null;

  try {
    const { data } = await api.get("/auth/me");
    const usuario = data?.user || data || null; // unifica forma
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    }
    return usuario;
  } catch {
    return null;
  }
}

/** Logout: limpia el almacenamiento local */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}
