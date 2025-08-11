import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-indigo-50 to-emerald-50">
      <main className="max-w-6xl mx-auto px-4 py-8 pb-28">
        <Outlet />
      </main>
      <Navbar /> {/* barra inferior fija */}
    </div>
  );
}
