import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GiChopsticks } from "react-icons/gi";
import { FaHome, FaPlusCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const btn = "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs md:text-sm transition";
const idle = "text-slate-700 hover:text-pink-700";
const active = "text-pink-700 bg-pink-100/70 ring-1 ring-pink-300";

function Item({ to, icon: Icon, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${btn} ${isActive ? active : idle}`}>
      <Icon className="text-lg md:text-xl opacity-90" />
      <span className="leading-none">{children}</span>
    </NavLink>
  );
}

// 🔥 NOMBRE CONSISTENTE CON EL ARCHIVO
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="bg-white/85 backdrop-blur-xl shadow-[0_-6px_30px_rgba(236,72,153,.18)] ring-1 ring-slate-200/70">
        <div className="max-w-6xl mx-auto px-3">
          <nav className="h-16 flex items-center justify-between gap-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-800">
              <GiChopsticks className="text-pink-500 text-xl" />
              <span className="hidden sm:block font-extrabold">
                <span className="text-pink-500">K-</span>
                <span className="text-indigo-600">Recetas</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Item to="/" icon={FaHome}>Inicio</Item>
              {user && <Item to="/nueva" icon={FaPlusCircle}>Subir</Item>}
              {!user ? (
                <>
                  <Item to="/login" icon={FaSignInAlt}>Login</Item>
                  <Item to="/register" icon={FaUserPlus}>Registro</Item>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs md:text-sm bg-emerald-500 text-white hover:opacity-90"
                >
                  <FaSignOutAlt className="text-lg md:text-xl" />
                  <span className="leading-none">Salir</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
