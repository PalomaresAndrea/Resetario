import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { Usuario } from "../models/Usuario.js";
import { enviarOTP } from "../utils/mailer.js";

const saltRounds = 10;

function crearToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function validarPasswordFuerte(pwd) {
  // mín 8, mayus, minus, dígito y símbolo
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(pwd);
}

function generarOTP() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

/** POST /auth/register
 * body: { nombre, apellidoPaterno, apellidoMaterno?, correo, password, password2 }
 * crea usuario (verificado=false), envía OTP por correo
 */
export async function registrar(req, res) {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno = "", correo, password, password2 } = req.body;

    if (!nombre?.trim() || !apellidoPaterno?.trim()) {
      return res.status(400).json({ message: "Nombre y apellido paterno son obligatorios" });
    }
    if (!validator.isEmail(correo || "")) {
      return res.status(400).json({ message: "Correo inválido" });
    }
    if (password !== password2) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }
    if (!validarPasswordFuerte(password)) {
      return res.status(400).json({ message: "La contraseña no cumple la política" });
    }

    const ya = await Usuario.findOne({ correo });
    if (ya && ya.verificado) {
      return res.status(409).json({ message: "Ese correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    // crea o actualiza usuario no verificado
    let user = ya;
    if (!user) user = new Usuario({ nombre, apellidoPaterno, apellidoMaterno, correo, passwordHash });
    else {
      user.nombre = nombre; user.apellidoPaterno = apellidoPaterno; user.apellidoMaterno = apellidoMaterno;
      user.passwordHash = passwordHash;
    }

    // OTP
    const codigo = generarOTP();
    user.otpHash = await bcrypt.hash(codigo, saltRounds);
    user.otpExpira = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.verificado = false;
    await user.save();

    await enviarOTP(correo, codigo);

    res.json({ message: "OTP enviado al correo. Verifica para completar el registro." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al registrar" });
  }
}

/** POST /auth/verify-otp
 * body: { correo, otp }
 * marca verificado y retorna token + user
 */
export async function verificarOTP(req, res) {
  try {
    const { correo, otp } = req.body;
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (!user.otpHash || !user.otpExpira) return res.status(400).json({ message: "No hay OTP pendiente" });
    if (user.otpExpira < new Date()) return res.status(400).json({ message: "OTP vencido" });

    const ok = await bcrypt.compare(String(otp), user.otpHash);
    if (!ok) return res.status(400).json({ message: "OTP incorrecto" });

    user.verificado = true;
    user.otpHash = undefined;
    user.otpExpira = undefined;
    await user.save();

    const token = crearToken(user);
    const lean = { id: user._id, nombre: user.nombre, correo: user.correo };
    res.json({ token, user: lean });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al verificar OTP" });
  }
}

/** POST /auth/login
 * body: { correo, password }
 */
export async function login(req, res) {
  try {
    const { correo, password } = req.body;
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(400).json({ message: "Credenciales inválidas" });
    if (!user.verificado) return res.status(403).json({ message: "Verifica tu correo antes de entrar" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Credenciales inválidas" });

    const token = crearToken(user);
    const lean = { id: user._id, nombre: user.nombre, correo: user.correo };
    res.json({ token, user: lean });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

/** POST /auth/resend-otp
 * body: { correo }
 */
export async function reenviarOTP(req, res) {
  try {
    const { correo } = req.body;
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.verificado) return res.status(400).json({ message: "Ya está verificado" });

    const codigo = generarOTP();
    user.otpHash = await bcrypt.hash(codigo, saltRounds);
    user.otpExpira = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await enviarOTP(correo, codigo);
    res.json({ message: "Nuevo OTP enviado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "No se pudo reenviar OTP" });
  }
}
