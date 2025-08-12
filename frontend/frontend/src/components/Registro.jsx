import { useState } from 'react';
import { registrarUsuario, verificarOTP } from '../services/usuarioService';
import './Registro.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Registro({ cambiarVista }) {
  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contraseña: '',
    confirmar: '',
    otp: '',
    paso: 1
  });

  const [errores, setErrores] = useState({});
  const [verContraseña, setVerContraseña] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const nuevosErrores = { ...errores };

    if (name === 'nombre' && !value.trim()) {
      nuevosErrores.nombre = 'Nombre requerido';
    }
    if (name === 'apellidoPaterno' && !value.trim()) {
      nuevosErrores.apellidoPaterno = 'Apellido paterno requerido';
    }
    if (name === 'correo' && !validarCorreo(value)) {
      nuevosErrores.correo = 'Correo no válido';
    }
    if (name === 'contraseña' && !validarContraseña(value)) {
      nuevosErrores.contraseña = 'Debe tener 8 caracteres, mayúscula, número y símbolo';
    }
    if (name === 'confirmar' && value !== form.contraseña) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
  };

  const validarCorreo = correo =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const validarContraseña = contraseña =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña);

  const validarCampos = () => {
    const errores = {};

    if (!form.nombre.trim()) errores.nombre = 'Nombre requerido';
    if (!form.apellidoPaterno.trim()) errores.apellidoPaterno = 'Apellido paterno requerido';
    if (!validarCorreo(form.correo)) errores.correo = 'Correo inválido';
    if (!form.contraseña) errores.contraseña = 'Contraseña requerida';
    else if (!validarContraseña(form.contraseña))
      errores.contraseña = 'Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo';
    if (form.contraseña !== form.confirmar) errores.confirmar = 'Las contraseñas no coinciden';

    return errores;
  };

  const enviarRegistro = async () => {
    const erroresValidados = validarCampos();
    setErrores(erroresValidados);
    if (Object.keys(erroresValidados).length > 0) return;

    try {
      const res = await registrarUsuario(form);
      alert(res.mensaje);
      setForm({ ...form, paso: 2 });
    } catch (err) {
      alert('Error al registrar: ' + err.message);
    }
  };

  const verificar = async () => {
    if (!form.otp) return alert('Debes ingresar el OTP');

    try {
      const res = await verificarOTP(form.correo, form.otp);
      alert(res.mensaje);
      setForm({ ...form, paso: 3 });
    } catch (err) {
      alert('OTP inválido: ' + err.message);
    }
  };

  const formularioCompleto =
    form.nombre &&
    form.apellidoPaterno &&
    form.correo &&
    form.contraseña &&
    form.confirmar &&
    form.contraseña === form.confirmar;

  return (
    <div className="registro-container">
      {form.paso === 1 && (
        <>
          <h2 className="registro-titulo">Registro</h2>

          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input ${errores.nombre ? 'input-error' : ''}`}
          />
          {errores.nombre && <p className="error">{errores.nombre}</p>}

          <input
            name="apellidoPaterno"
            placeholder="Apellido Paterno"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input ${errores.apellidoPaterno ? 'input-error' : ''}`}
          />
          {errores.apellidoPaterno && <p className="error">{errores.apellidoPaterno}</p>}

          <input
            name="apellidoMaterno"
            placeholder="Apellido Materno"
            onChange={handleChange}
            className="input"
          />

          <input
            name="correo"
            placeholder="Correo electrónico"
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input ${errores.correo ? 'input-error' : ''}`}
          />
          {errores.correo && <p className="error">{errores.correo}</p>}

          <div className="password-container">
            <input
              name="contraseña"
              type={verContraseña ? 'text' : 'password'}
              placeholder="Contraseña segura"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${errores.contraseña ? 'input-error' : ''}`}
            />
            <span onClick={() => setVerContraseña(!verContraseña)} className="eye-icon">
              {verContraseña ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errores.contraseña && <p className="error">{errores.contraseña}</p>}

          <div className="password-container">
            <input
              name="confirmar"
              type={verContraseña ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${errores.confirmar ? 'input-error' : ''}`}
            />
            <span onClick={() => setVerContraseña(!verContraseña)} className="eye-icon">
              {verContraseña ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errores.confirmar && <p className="error">{errores.confirmar}</p>}

          <button
            onClick={enviarRegistro}
            disabled={!formularioCompleto}
            className={`boton ${formularioCompleto ? '' : 'deshabilitado'}`}
          >
            Enviar Registro
          </button>

          <p className="texto-cambio-vista">
            ¿Ya tienes cuenta?{' '}
            <button className="boton-cambio" onClick={cambiarVista}>
              Inicia sesión
            </button>
          </p>
        </>
      )}

      {form.paso === 2 && (
        <>
          <h2 className="registro-titulo">Verifica tu correo</h2>
          <input
            name="otp"
            placeholder="Código OTP"
            onChange={handleChange}
            className="input"
          />
          <button onClick={verificar} className="boton-verde">
            Verificar OTP
          </button>
        </>
      )}

      {form.paso === 3 && (
        <h3 className="registro-exito">✅ Registro exitoso. Ahora inicia sesión.</h3>
      )}
    </div>
  );
}
