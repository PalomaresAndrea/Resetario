import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellidoPaterno: { type: String, required: true, trim: true },
  apellidoMaterno: { type: String, default: "", trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  verificado: { type: Boolean, default: false },

  otpHash: String,
  otpExpira: Date,

}, { timestamps: true });

export const Usuario = mongoose.model("Usuario", usuarioSchema);
