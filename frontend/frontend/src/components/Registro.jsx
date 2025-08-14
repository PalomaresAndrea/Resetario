import { useEffect, useState } from "react";
import { registrarUsuario, verificarOTP, reenviarOTP } from "../services/usuarioService";
import OTPInput from "../components/OTPInput";
import "./Registro.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Registro({ cambiarVista }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contraseña: "",
    confirmar: "",
    otp: "",
    paso: 1,
  });

  const [errores, setErrores] = useState({});
  const [verContraseña, setVerContraseña] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // cooldown del botón "Reenviar OTP"
  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const validarContraseña = (c) => /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(c);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const nuevos = { ...errores };

    if (name === "nombre" && !value.trim()) nuevos.nombre = "Nombre requerido";
    if (name === "apellidoPaterno" && !value.trim())
      nuevos.apellidoPaterno = "Apellido paterno requerido";
    if (name === "correo" && !validarCorreo(value))
      nuevos.correo = "Correo no válido";
    if (name === "contraseña" && !validarContraseña(value))
      nuevos.contraseña = "Debe tener 8 caracteres, mayúscula, número y símbolo";
    if (name === "confirmar" && value !== form.contraseña)
      nuevos.confirmar = "Las contraseñas no coinciden";

    setErrores(nuevos);
  };

  const validarCampos = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Nombre requerido";
    if (!form.apellidoPaterno.trim())
      e.apellidoPaterno = "Apellido paterno requerido";
    if (!validarCorreo(form.correo)) e.correo = "Correo inválido";
    if (!form.contraseña) e.contraseña = "Contraseña requerida";
    else if (!validarContraseña(form.contraseña))
      e.contraseña =
        "Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo";
    if (form.contraseña !== form.confirmar)
      e.confirmar = "Las contraseñas no coinciden";
    return e;
  };

  const enviarRegistro = async () => {
    const v = validarCampos();
    setErrores(v);
    if (Object.keys(v).length) return;

    try {
      const res = await registrarUsuario(form);
      alert(res.message || res.mensaje || "Registro enviado. Revisa tu correo.");
      setForm((prev) => ({ ...prev, paso: 2 }));
      setCooldown(60); // cooldown de reenvío
    } catch (err) {
      alert("Error al registrar: " + (err.message || err.toString()));
    }
  };

  const verificar = async () => {
    if (!form.otp || form.otp.length < 6)
      return alert("Debes ingresar el OTP completo");
    try {
      const res = await verificarOTP(form.correo, form.otp);
      alert(res.message || res.mensaje || "Correo verificado");
      setForm((prev) => ({ ...prev, paso: 3 }));
    } catch (err) {
      alert("OTP inválido: " + (err.message || err.toString()));
    }
  };

  const reenviar = async () => {
    if (cooldown) return;
    try {
      const res = await reenviarOTP(form.correo);
      alert(res.message || res.mensaje || "OTP reenviado");
      setCooldown(60);
    } catch (err) {
      alert(err.message || "No se pudo reenviar");
    }
  };

  const completo =
    form.nombre &&
    form.apellidoPaterno &&
    form.correo &&
    form.contraseña &&
    form.confirmar &&
    form.contraseña === form.confirmar;

  return (
    <div className="registro-bg">
      <div className="registro-container">
        {form.paso === 1 && (
          <>
            <h2 className="registro-titulo">Crea tu cuenta</h2>
            <p className="registro-sub">
              Guarda tus recetas y colabora con tus amigos ✨
            </p>

            <input
              name="nombre"
              placeholder="Nombre *"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${errores.nombre ? "input-error" : ""}`}
            />
            {errores.nombre && <p className="error">{errores.nombre}</p>}

            <input
              name="apellidoPaterno"
              placeholder="Apellido paterno *"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${errores.apellidoPaterno ? "input-error" : ""}`}
            />
            {errores.apellidoPaterno && (
              <p className="error">{errores.apellidoPaterno}</p>
            )}

            <input
              name="apellidoMaterno"
              placeholder="Apellido materno (opcional)"
              onChange={handleChange}
              className="input"
            />

            <input
              name="correo"
              placeholder="Correo electrónico *"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${errores.correo ? "input-error" : ""}`}
            />
            {errores.correo && <p className="error">{errores.correo}</p>}

            <div className="password-container">
              <input
                name="contraseña"
                type={verContraseña ? "text" : "password"}
                placeholder="Contraseña segura *"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${errores.contraseña ? "input-error" : ""}`}
              />
              <span
                onClick={() => setVerContraseña((v) => !v)}
                className="eye-icon"
              >
                {verContraseña ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errores.contraseña && (
              <p className="error">{errores.contraseña}</p>
            )}

            <div className="password-container">
              <input
                name="confirmar"
                type={verContraseña ? "text" : "password"}
                placeholder="Confirmar contraseña *"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${errores.confirmar ? "input-error" : ""}`}
              />
              <span
                onClick={() => setVerContraseña((v) => !v)}
                className="eye-icon"
              >
                {verContraseña ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errores.confirmar && <p className="error">{errores.confirmar}</p>}

            <button
              onClick={enviarRegistro}
              disabled={!completo}
              className={`boton ${completo ? "" : "deshabilitado"}`}
            >
              Enviar registro
            </button>

            <p className="texto-cambio-vista">
              ¿Ya tienes cuenta?{" "}
              <button className="boton-cambio" onClick={cambiarVista}>
                Inicia sesión
              </button>
            </p>
          </>
        )}

        {form.paso === 2 && (
          <>
            <h2 className="registro-titulo">Verifica tu correo</h2>
            <p className="registro-sub">
              Te enviamos un código OTP a <b>{form.correo}</b>
            </p>

            <div className="mb-4" style={{ display: "flex", justifyContent: "center" }}>
              <OTPInput
                length={6}
                value={form.otp}
                onChange={(v) => setForm((prev) => ({ ...prev, otp: v }))}
                autoFocus
              />
            </div>

            <div className="flex gap-3" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={verificar} className="boton-verde" disabled={(form.otp?.length || 0) < 6}>
                Verificar OTP
              </button>
              <button onClick={reenviar} className="boton-secundario" disabled={!!cooldown}>
                {cooldown ? `Reenviar (${cooldown})` : "Reenviar OTP"}
              </button>
            </div>
          </>
        )}

        {form.paso === 3 && (
          <h3 className="registro-exito">
            ✅ Registro exitoso. Ahora inicia sesión.
          </h3>
        )}
      </div>
    </div>
  );
}
