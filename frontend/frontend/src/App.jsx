// src/App.jsx
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { loading, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  // Si ya hay sesión y caes en /login, manda a /nueva
  useEffect(() => {
    if (!loading && user && loc.pathname === "/login") {
      nav("/nueva", { replace: true });
    }
  }, [loading, user, loc.pathname, nav]);

  // Responder a 401 global (definido en api.js)
  useEffect(() => {
    const onUnauthorized = () => nav("/login", { replace: true });
    window.addEventListener("app:unauthorized", onUnauthorized);
    return () => window.removeEventListener("app:unauthorized", onUnauthorized);
  }, [nav]);

  // Spinner simple mientras hidrata sesión
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-sm opacity-70">Cargando…</div>
      </div>
    );
  }

  const hideNavbar = loc.pathname === "/login";

  return (
    <div className="app">
      <main className="page">
        <Outlet />
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
