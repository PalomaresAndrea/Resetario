// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import AuthProvider, { useAuth } from "./context/AuthContext.jsx";
import App from "./App.jsx";

// 👇 tus componentes nuevos
import Inicio from "./components/inicio.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Registro from "./components/Registro.jsx";

// 👇 páginas existentes
import Recetas from "./pages/Recetas.jsx";
import NuevaReceta from "./pages/NuevaReceta.jsx";

// Ruta privada
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;                 // o un spinner
  return user ? children : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout con Navbar */}
          <Route element={<App />}>
            <Route index element={<Inicio />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/recetas" element={<Recetas />} />
            <Route
              path="/nueva"
              element={
                <PrivateRoute>
                  <NuevaReceta />
                </PrivateRoute>
              }
            />
            {/* 404 opcional */}
            <Route path="*" element={<Inicio />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
