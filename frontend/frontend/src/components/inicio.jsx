import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inicio.css";
import FeaturedCarousel from "./FeaturedCarousel.jsx";             // 👈 nuevo
import { fetchFeatured } from "../services/recipesService.js";     // 👈 nuevo

export default function Inicio({ onLoginClick, onRegisterClick }) {
  const nav = useNavigate();
  const [term, setTerm] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "Tu receta, tu historia: añade una anécdota a cada plato ✍️",
    "Etiqueta tus recetas por ingrediente para encontrarlas rápido 🏷️",
    "Las fotos con luz natural hacen que todo se vea más delicioso 📸",
    "Comparte tu receta con amigos y pídele su versión colaborativa 🤝",
    "Usa medidas consistentes y añade tiempos de preparación ⏱️",
  ];

  // 👇 destacados
  const [featured, setFeatured] = useState([]);
  useEffect(() => { fetchFeatured().then(setFeatured); }, []);

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i)=> (i+1)%tips.length), 5000);
    return () => clearInterval(id);
  }, []);

  const goLogin = () => (onLoginClick ? onLoginClick() : nav("/login"));
  const goRegister = () => (onRegisterClick ? onRegisterClick() : nav("/register"));
  const goRecetas = () => nav("/recetas");
  const search = (e) => {
    e.preventDefault();
    const q = term.trim();
    nav(q ? `/recetas?q=${encodeURIComponent(q)}` : "/recetas");
  };
  const openCat = (cat) => nav(`/recetas?cat=${encodeURIComponent(cat)}`);

  const categorias = [
    { emoji: "🌮", label: "Tacos" }, { emoji: "🍝", label: "Pasta" },
    { emoji: "🍰", label: "Postres" }, { emoji: "🥗", label: "Ensaladas" },
    { emoji: "🍜", label: "Sopas" }, { emoji: "🥪", label: "Sandwiches" },
  ];

  return (
    <div className="inicio">
      <div className="fruit-cloud" aria-hidden="true">
        <span>🍓</span><span>🍋</span><span>🍇</span><span>🍑</span><span>🍍</span>
        <span>🥑</span><span>🍒</span><span>🍉</span><span>🍌</span><span>🥕</span>
      </div>

      <section className="hero">
        <h1 className="brand">Recetario</h1>
        <p className="slogan">Tu receta, tu historia ✨</p>
        <p className="sub">Comparte, cocina y guarda tus sabores favoritos con tus amigos.</p>

        {/* buscador */}
        <form className="search" onSubmit={search}>
          <span className="search-icon" aria-hidden="true">🔎</span>
          <input className="search-input" placeholder="Busca por ingrediente o nombre…"
                 value={term} onChange={(e)=>setTerm(e.target.value)} />
          <button className="btn btn-primary" type="submit">Buscar</button>
        </form>

        {/* chips */}
        <div className="chips">
          {categorias.map(c=>(
            <button key={c.label} className="chip" onClick={()=>openCat(c.label)}>
              <span className="chip-emoji">{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>

        {/* tip */}
        <div className="tip">
          <span className="tip-emoji">💡</span>
          <span className="tip-text">{tips[tipIndex]}</span>
        </div>

        {/* 👉 Destacadas */}
        <h3 className="section-title">Recetas destacadas</h3>
        <FeaturedCarousel recipes={featured} />

        {/* CTA */}
        <div className="cta">
          <button className="btn btn-primary" onClick={goRecetas}>Explorar recetas</button>
          <button className="btn btn-ghost" onClick={goLogin}>Iniciar sesión</button>
          <button className="btn btn-success" onClick={goRegister}>Registrarme</button>
        </div>
      </section>
    </div>
  );
}
