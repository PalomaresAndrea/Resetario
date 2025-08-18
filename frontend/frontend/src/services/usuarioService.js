// src/services/usuarioService.js
import api from "./api";

/** Registro con OTP (o sin OTP; ambos funcionan) */
export async function registrarUsuario(form) {
  // Construye el "name" que el backend espera
  const name = [form.nombre, form.apellidoPaterno, form.apellidoMaterno]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const body = {
    // <-- el backend exige "name"
    name,

    // Si tu backend también guarda estos campos, mándalos opcionalmente:
    nombre: form.nombre?.trim(),
    apellidoPaterno: form.apellidoPaterno?.trim(),
    apellidoMaterno: form.apellidoMaterno?.trim(),

    // Campos obligatorios
    email: form.correo?.toLowerCase().trim(),
    password: form.contraseña,
  };

  const { data } = await api.post("/auth/register", body);
  return data;
}

export async function verificarOTP(email, otp) {
  const { data } = await api.post("/auth/verify-otp", {
    email: email?.toLowerCase().trim(),
    otp: String(otp),
  });
  if (data?.token && data?.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));
  }
  return data;
}

export async function reenviarOTP(email) {
  const { data } = await api.post("/auth/resend-otp", {
    email: email?.toLowerCase().trim(),
  });
  return data;
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", {
    email: email?.toLowerCase().trim(),
    password,
  });
  if (data?.token && data?.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));
  }
  return data;
}

export async function me() {
  const t = localStorage.getItem("token");
  if (!t) return null;
  try {
    const { data } = await api.get("/auth/me");
    const usuario = data?.user || data || null;
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    return usuario;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}
