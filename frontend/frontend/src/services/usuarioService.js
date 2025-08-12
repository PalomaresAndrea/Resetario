// src/services/usuarioService.js
// Servicio MOCK para desarrollo (sin backend)
// Guarda usuarios en localStorage y simula OTP por alerta.

const LS_KEY = "mock_users";

const sleep = (ms = 700) => new Promise(r => setTimeout(r, ms));

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function genOTP() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

export async function registrarUsuario(payload) {
  await sleep();
  const { nombre, apellidoPaterno, apellidoMaterno = "", correo, password, password2 } = payload;

  if (!nombre?.trim() || !apellidoPaterno?.trim()) throw new Error("Nombre y apellido paterno son obligatorios");
  if (!emailRe.test(correo || "")) throw new Error("Correo inválido");
  if (password !== password2) throw new Error("Las contraseñas no coinciden");
  if (!passPolicy.test(password)) throw new Error("La contraseña no cumple la política");

  const users = loadUsers();
  const idx = users.findIndex(u => u.correo.toLowerCase() === correo.toLowerCase());
  if (idx !== -1 && users[idx].verificado) throw new Error("Ese correo ya está registrado");

  const passwordHash = await sha256(password);
  const otp = genOTP();
  const otpExpira = Date.now() + 10 * 60 * 1000;

  const user = {
    nombre, apellidoPaterno, apellidoMaterno, correo,
    passwordHash, verificado: false, otp, otpExpira
  };

  if (idx === -1) users.push(user);
  else users[idx] = { ...users[idx], ...user };

  saveUsers(users);

  // "Enviar" OTP (mock)
  console.log("OTP para", correo, "=>", otp);
  alert(`Tu código OTP (mock): ${otp}`);

  return { message: "OTP enviado al correo (mock)" };
}

export async function verificarOTP(correo, otp) {
  await sleep();
  const users = loadUsers();
  const u = users.find(x => x.correo.toLowerCase() === (correo || "").toLowerCase());
  if (!u) throw new Error("Usuario no encontrado");
  if (u.verificado) return login(correo, null, true); // ya verificado

  if (!u.otp || !u.otpExpira) throw new Error("No hay OTP pendiente");
  if (Date.now() > u.otpExpira) throw new Error("OTP vencido");
  if (String(otp) !== String(u.otp)) throw new Error("OTP incorrecto");

  u.verificado = true;
  u.otp = null;
  u.otpExpira = null;
  saveUsers(users);

  // crear "token" mock
  const token = `mock.${btoa(u.correo)}.${Date.now()}`;
  const user = { nombre: u.nombre, correo: u.correo };
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { token, user };
}

export async function login(correo, password, skipPass = false) {
  await sleep();
  const users = loadUsers();
  const u = users.find(x => x.correo.toLowerCase() === (correo || "").toLowerCase());
  if (!u) throw new Error("Credenciales inválidas");
  if (!u.verificado) throw new Error("Verifica tu correo antes de entrar");

  if (!skipPass) {
    const hash = await sha256(password || "");
    if (hash !== u.passwordHash) throw new Error("Credenciales inválidas");
  }

  const token = `mock.${btoa(u.correo)}.${Date.now()}`;
  const user = { nombre: u.nombre, correo: u.correo };
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { token, user };
}

export async function reenviarOTP(correo) {
  await sleep();
  const users = loadUsers();
  const u = users.find(x => x.correo.toLowerCase() === (correo || "").toLowerCase());
  if (!u) throw new Error("Usuario no encontrado");
  if (u.verificado) throw new Error("Ese usuario ya está verificado");

  u.otp = genOTP();
  u.otpExpira = Date.now() + 10 * 60 * 1000;
  saveUsers(users);
  console.log("Nuevo OTP para", correo, "=>", u.otp);
  alert(`Nuevo OTP (mock): ${u.otp}`);
  return { message: "Nuevo OTP enviado (mock)" };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
