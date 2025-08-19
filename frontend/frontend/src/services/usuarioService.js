import api from "./api";

/** Registro con OTP (o sin OTP; ambos funcionan) */
export async function registrarUsuario(form) {
  const name = [form.nombre, form.apellidoPaterno, form.apellidoMaterno]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const body = {
    name,
    nombre: form.nombre?.trim(),
    apellidoPaterno: form.apellidoPaterno?.trim(),
    apellidoMaterno: form.apellidoMaterno?.trim(),
    email: form.correo?.toLowerCase().trim(),
    password: form.contraseña,
  };

  const { data } = await api.post("/auth/register", body);
  return data; // { message, ... }
}

export async function verificarOTP(email, otp) {
  const { data } = await api.post("/auth/verify-otp", {
    email: email?.toLowerCase().trim(),
    otp: String(otp),
  });
  return data; // { token, user } (o usuario en algunos backends)
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
  // No tocamos localStorage aquí; lo maneja el AuthContext para coherencia.
  return data; // { token, user } (si tu backend usa "usuario", el contexto lo contempla)
}

export async function me() {
  try {
    const { data } = await api.get("/auth/me");
    // Normaliza: puede venir como {user: {...}} o directamente el usuario
    return data?.user || data || null;
  } catch {
    return null;
  }
}
