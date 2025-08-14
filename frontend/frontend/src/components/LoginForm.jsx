// LoginForm.jsx
import { useState } from "react";
import "./LoginForm.css";
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ cambiarVista }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");

  const { doLogin } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await doLogin(email, password);   // ✅ esto actualiza AuthContext.user
      nav("/nueva");                    // ✅ redirige tras login
    } catch (err) {
      setError(err?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <header className="login-head">
          <h1 className="login-title">¡Bienvenida de vuelta!</h1>
          <p className="login-sub">Accede para guardar y compartir tus recetas 🍳</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="lab" htmlFor="email">Correo</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="lab" htmlFor="password">Contraseña</label>
          <div className="password-field">
            <FaLock className="input-icon" />
            <input
              type={verPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {verPassword ? (
              <FaRegEyeSlash className="eye-icon" onClick={() => setVerPassword(false)} title="Ocultar" />
            ) : (
              <FaRegEye className="eye-icon" onClick={() => setVerPassword(true)} title="Ver" />
            )}
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={!email || !password}>
            Entrar
          </button>
        </form>

        <div className="login-alt">
          ¿No tienes cuenta?{" "}
          <button className="link" onClick={cambiarVista}>
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}
