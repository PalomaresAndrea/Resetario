import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { login as apiLogin, me as apiMe } from "../services/usuarioService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setSession = useCallback((token, u) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    if (u) {
      localStorage.setItem("usuario", JSON.stringify(u));
      setUser(u);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }, []);

  // Hidratar sesión al iniciar
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { setLoading(false); return; }

    // Intenta recuperar el usuario
    apiMe()
      .then((u) => {
        if (u) {
          setUser(u);
          api.defaults.headers.common.Authorization = `Bearer ${t}`;
        } else {
          clearSession();
        }
      })
      .finally(() => setLoading(false));
  }, [clearSession]);

  // Escucha 401 globales desde el interceptor
  useEffect(() => {
    const onUnauthorized = () => clearSession();
    window.addEventListener("app:unauthorized", onUnauthorized);
    return () => window.removeEventListener("app:unauthorized", onUnauthorized);
  }, [clearSession]);

  // Login
  const doLogin = async (email, password) => {
    const data = await apiLogin(email, password);
    // Normaliza: tu backend podría devolver "user" o "usuario"
    const token = data?.token;
    const u = data?.user || data?.usuario;

    if (!token || !u) {
      const msg = data?.error || "Respuesta de login inválida";
      throw new Error(msg);
    }
    setSession(token, u);
    return u;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, doLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
