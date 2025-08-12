import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inicio.css";
import FeaturedCarousel from "./FeaturedCarousel.jsx";
import { fetchFeatured } from "../services/recipesService.js";

export default function Inicio({ onLoginClick, onRegisterClick }) {
  const nav = useNavigate();

  // Estado UI
  const [term, setTerm] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [featured, setFeatured] = useState([]);

  // Tips rotatorios
  const tips = [
    "Tu receta, tu historia: añade una anécdota a cada plato ✍️",
    "Etiqueta tus recetas por ingrediente para encontrarlas rápido 🏷️",
    "Las fotos con luz natural hacen que todo se vea más delicioso 📸",
    "Comparte tu receta con amigos y pídele su versión colaborativa 🤝",
    "Usa medidas consistentes y añade tiempos de preparación ⏱️",
  ];

  useEffect(() => { fetchFeatured().then(setFeatured); }, []);
  useEffect(() => {
    const id = setInterval(() => setTipIndex((i)=> (i+1)%tips.length), 5000);
    return () => clearInterval(id);
  }, []);

  // Navegación
  const goLogin = () => (onLoginClick ? onLoginClick() : nav("/login"));
  const goRegister = () => (onRegisterClick ? onRegisterClick() : nav("/register"));
  const goRecetas = () => nav("/recetas");

  // Búsqueda
  const search = (e) => {
    e.preventDefault();
    const q = term.trim();
    nav(q ? `/recetas?q=${encodeURIComponent(q)}` : "/recetas");
  };
  const openCat = (cat) => nav(`/recetas?cat=${encodeURIComponent(cat)}`);

  // Categorías rápidas
  const categorias = [
    { emoji: "🌮", label: "Tacos" },
    { emoji: "🍝", label: "Pasta" },
    { emoji: "🍰", label: "Postres" },
    { emoji: "🥗", label: "Ensaladas" },
    { emoji: "🍜", label: "Sopas" },
    { emoji: "🥪", label: "Sandwiches" },
  ];

  return (
    <div className="inicio">
      {/* Fondo decorativo */}
      <div className="fruit-cloud" aria-hidden="true">
        <span>🍓</span><span>🍋</span><span>🍇</span><span>🍑</span><span>🍍</span>
        <span>🥑</span><span>🍒</span><span>🍉</span><span>🍌</span><span>🥕</span>
      </div>

      <section className="hero">
        <h1 className="brand">Recetario</h1>
        <p className="slogan">Tu receta, tu historia ✨</p>
        <p className="sub">Comparte, cocina y guarda tus sabores favoritos con tus amigos.</p>

        {/* BARRA DE BÚSQUEDA: input | botón buscar (icono) | Ver recetas (en el espacio de la derecha) */}
        <form className="search" onSubmit={search}>
          <span className="search-icon" aria-hidden="true">🔎</span>
          <input
            className="search-input"
            placeholder="Busca por ingrediente o nombre…"
            value={term}
            onChange={(e)=>setTerm(e.target.value)}
            aria-label="Buscar recetas"
          />
          <button
            className="btn btn-icon"
            type="submit"
            title="Buscar"
            aria-label="Buscar"
          >
            🔍
          </button>
          <button
            type="button"
            className="btn to-recipes-in-search"
            onClick={goRecetas}
            title="Ver todas las recetas"
          >
            <span className="emoji">📖</span>
            <span className="label">Ver recetas</span>
          </button>
        </form>

        {/* Chips de categorías */}
        <div className="chips">
          {categorias.map(c=>(
            <button key={c.label} className="chip" onClick={()=>openCat(c.label)}>
              <span className="chip-emoji">{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>

        {/* Tip rotatorio */}
        <div className="tip" aria-live="polite">
          <span className="tip-emoji">💡</span>
          <span className="tip-text">{tips[tipIndex]}</span>
        </div>

        {/* Destacadas */}
        <h3 className="section-title">Recetas destacadas</h3>
        <FeaturedCarousel recipes={featured} />

        {/* CTAs inferiores: ocupa el espacio bajo el carrusel (como en la cap) */}
        <div className="cta">
          <button className="btn btn-ghost" onClick={goLogin}>Iniciar sesión</button>
          <button className="btn btn-success" onClick={goRegister}>Registrarme</button>
        </div>
      </section>
    </div>
  );
}
