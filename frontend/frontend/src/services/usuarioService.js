// src/services/usuarioService.js
// Mock de auth para desarrollo (sin backend). Usa localStorage.

const WAIT = (ms = 250) => new Promise(r => setTimeout(r, ms));
const UKEY = "mock_user";   // guarda el usuario
const TKEY = "token";       // guarda el token

export async function login(email, password) {
  await WAIT(300);
  if (!email || !password) throw new Error("Correo y contraseña son obligatorios");

  // usuario simulado
  const user = {
    id: "u_" + Date.now(),
    nombre: email.split("@")[0],  // solo para demo
    email,
  };

  // token simulado
  const token = "mock-token-" + Date.now();

  // persistimos para que /me funcione al recargar
  localStorage.setItem(UKEY, JSON.stringify(user));
  localStorage.setItem(TKEY, token);

  return { token, user };
}

export async function me() {
  await WAIT(150);
  const token = localStorage.getItem(TKEY);
  if (!token) return null;
  const raw = localStorage.getItem(UKEY);
  return raw ? JSON.parse(raw) : null;
}

export async function register(payload) {
  await WAIT(350);
  // aquí podrías validar campos; por ahora solo echo back
  return { ok: true, user: { id: "u_" + Date.now(), ...payload } };
}

// Si más adelante haces OTP real, aquí puedes simularlo
export async function verifyOtp(email, code) {
  await WAIT(150);
  return { ok: true };
}
export { register as registrarUsuario, verifyOtp as verificarOTP };
