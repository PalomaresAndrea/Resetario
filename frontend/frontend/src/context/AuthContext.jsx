// src/context/AuthContext.jsx (o donde lo tengas)
import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, me as apiMe } from "../services/usuarioService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { setLoading(false); return; }
    apiMe()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const doLogin = async (email, password) => {
    // 👇 OJO: aquí va "usuario", no "user"
    const { token, usuario } = await apiLogin(email, password);
    if (token && usuario) {
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setUser(usuario);                 // 👈 ahora sí actualiza el contexto
    }
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, doLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
