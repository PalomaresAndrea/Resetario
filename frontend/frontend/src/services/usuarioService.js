// src/services/usuarioService.js

// 1) Base URL: usa VITE_API_URL si está definida; si no, usa proxy /api
const ENV_API = (import.meta?.env?.VITE_API_URL || '').trim();
// Si ENV_API está vacío, dejaremos BASE vacío y fetch usará ruta relativa '/api/...'
// que el proxy de Vite enviará a http://localhost:3000
const BASE = ENV_API || '';

async function req(path, opts = {}) {
  const url = `${BASE}/api${path}`; // ej: http://localhost:3000/api/auth/login  o  /api/auth/login
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/** Registro
 * payload: { nombre, apellidoPaterno, apellidoMaterno?, correo, contraseña }
 */
export async function registrarUsuario(payload) {
  const fullName = `${payload.nombre} ${payload.apellidoPaterno}${
    payload.apellidoMaterno ? ' ' + payload.apellidoMaterno : ''
  }`.trim();

  const body = { name: fullName, email: payload.correo, password: payload.contraseña };
  return req('/auth/register', { method: 'POST', body: JSON.stringify(body) });
}

/** Verificar OTP */
export async function verificarOTP(email, code) {
  return req('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code }) });
}

/** Reenviar OTP */
export async function reenviarOTP(email) {
  return req('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) });
}

/** Login */
export async function login(email, password) {
  const data = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.user));
  return { token: data.token, user: data.user };
}

/** /me (requiere Bearer token) */
export async function me() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const data = await req('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.user || null;
  } catch {
    return null;
  }
}
