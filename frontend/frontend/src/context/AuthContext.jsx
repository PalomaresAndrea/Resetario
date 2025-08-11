import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, verifyOtpApi } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    const data = await loginApi(correo, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload) => {
    // Solo envía registro; la verificación se hace con verifyOtp()
    await registerApi(payload);
  };

  const verifyOtp = async (correo, otp) => {
    const data = await verifyOtpApi(correo, otp);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
