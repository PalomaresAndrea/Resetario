import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import AuthProvider from "./context/AuthContext";
import AppRouter from "./AppRouter";
import "./index.css";    // ✅


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
