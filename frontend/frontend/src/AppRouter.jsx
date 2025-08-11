// src/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Recetas from "./pages/Recetas.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NuevaReceta from "./pages/NuevaReceta.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Recetas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/nueva" element={<PrivateRoute><NuevaReceta /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
