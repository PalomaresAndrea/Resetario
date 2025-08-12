import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GiChopsticks } from "react-icons/gi";
import {
  FaHome, FaBookOpen, FaPlusCircle,
  FaSignInAlt, FaUserPlus, FaSignOutAlt
} from "react-icons/fa";
import "./Navbar.css";

function Item({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `dock-btn ${isActive ? "active" : ""}`}
    >
      <Icon className="ico" />
      <span className="lbl">{children}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="dock-wrap top">
      <nav className="dock">
        {/* Brand (izquierda) */}
        <div className="dock-brand" title="K-Recetas">
          <GiChopsticks className="brand-ico" />
          <span className="brand-txt">K-Recetas</span>
        </div>

        {/* Links centrales */}
        <div className="dock-links">
          <Item to="/" icon={FaHome}>Inicio</Item>
          <Item to="/recetas" icon={FaBookOpen}>Recetas</Item>
          {user && <Item to="/nueva" icon={FaPlusCircle}>Subir</Item>}
        </div>

        {/* Auth (derecha) */}
        <div className="dock-auth">
          {!user ? (
            <>
              <Item to="/login" icon={FaSignInAlt}>Login</Item>
              <Item to="/register" icon={FaUserPlus}>Registro</Item>
            </>
          ) : (
            <button className="dock-btn logout" onClick={logout}>
              <FaSignOutAlt className="ico" />
              <span className="lbl">Salir</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
