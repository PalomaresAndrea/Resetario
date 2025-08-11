import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(correo, password);
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Correo o contraseña incorrectos.");
    } finally { setLoading(false); }
  };

  const base = "w-full rounded-2xl border bg-white/80 p-3 pl-10 pr-12 outline-none transition border-pink-200 focus:ring-2 focus:ring-pink-300";

  return (
    <div className="max-w-md mx-auto bg-white/80 backdrop-blur border border-pink-100 rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
      <form onSubmit={submit} className="space-y-3">
        {/* Correo */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            type="email"
            placeholder="Correo"
            className={base}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Contraseña */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            type={show ? "text" : "password"}
            placeholder="Contraseña"
            className={base}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          disabled={loading}
          className="w-full rounded-2xl py-3 font-semibold text-white bg-indigo-600 hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm mt-2">
        ¿No tienes cuenta? <Link to="/register" className="text-indigo-600 underline">Regístrate</Link>
      </p>
    </div>
  );
}
