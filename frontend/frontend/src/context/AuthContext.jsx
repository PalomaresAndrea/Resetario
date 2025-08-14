import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, me as apiMe } from "../services/usuarioService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");   // <-- ojo: localStorage (l minúscula)
    if (!t) { setLoading(false); return; }
    apiMe()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const doLogin = async (email, password) => {
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem("token", token);      // <-- localStorage correcto
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");          // <-- localStorage correcto
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, doLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
