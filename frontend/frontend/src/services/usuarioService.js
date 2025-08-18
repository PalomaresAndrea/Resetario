import api from "./api";

/** Registro con OTP
 * payload: { nombre, apellidoPaterno, apellidoMaterno?, correo, contraseña }
 * Backend esperado: POST /auth/register  -> { message: "OTP enviado" }
 */
export async function registrarUsuario(payload) {
  const body = {
    nombre: payload.nombre?.trim(),
    apellidoPaterno: payload.apellidoPaterno?.trim(),
    apellidoMaterno: payload.apellidoMaterno?.trim(),
    email: payload.correo?.toLowerCase().trim(),
    password: payload.contraseña,
  };
  const { data } = await api.post("/auth/register", body);

  // Por si tu backend decide devolver token/user (no obligatorio en registro)
  if (data?.token && data?.user) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));
  }
  return data;
}

/** Verificar OTP
 * Backend: POST /auth/verify-otp { email, otp }
 */
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

/** Reenviar OTP
 * Backend: POST /auth/resend-otp { email }
 */
export async function reenviarOTP(email) {
  const { data } = await api.post("/auth/resend-otp", {
    email: email?.toLowerCase().trim(),
  });
  return data;
}

/** Login (opcional, si ya lo tienes) */
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
