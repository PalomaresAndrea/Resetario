// src/components/LoginForm.jsx
import { useState } from 'react';
import './LoginForm.css';
import { login } from '../services/usuarioService';
import { FaRegEye, FaRegEyeSlash, FaEnvelope } from 'react-icons/fa';

export default function LoginForm({ onLogin, cambiarVista }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      onLogin({ token: res.token, usuario: res.usuario }); // ✅ PASAMOS token y usuario
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Correo electrónico:</label>
        <div className="input-with-icon">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            id="email"
            placeholder="ejemplo@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <label htmlFor="password">Contraseña:</label>
        <div className="password-field">
          <input
            type={verPassword ? 'text' : 'password'}
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {verPassword ? (
            <FaRegEyeSlash
              className="eye-icon"
              onClick={() => setVerPassword(false)}
            />
          ) : (
            <FaRegEye
              className="eye-icon"
              onClick={() => setVerPassword(true)}
            />
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={!email || !password}>
          Entrar
        </button>
      </form>

      <div className="texto-cambio-vista">
        ¿No tienes cuenta?{' '}
        <button className="boton-cambio" onClick={cambiarVista}>
          Regístrate
        </button>
      </div>
    </div>
  );
}
