import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedCarousel.css";

export default function FeaturedCarousel({ recipes = [] }) {
  const ref = useRef(null);
  const nav = useNavigate();

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w * 0.9), behavior: "smooth" });
  };

  const open = (r) => {
    // No tenemos detalle aún: filtramos por título en /recetas
    nav(`/recetas?q=${encodeURIComponent(r.titulo)}`);
  };

  return (
    <div className="fc-wrap">
      <button className="fc-arrow left" onClick={() => scroll(-1)} aria-label="Anterior">‹</button>
      <div className="fc" ref={ref}>
        {recipes.map(r => (
          <button key={r.id} className="fc-card" onClick={() => open(r)}>
            <div className="fc-emoji">{r.emoji || "🍽️"}</div>
            <div className="fc-title">{r.titulo}</div>
            <div className="fc-meta">{r.categoria} • {r.tiempo}</div>
          </button>
        ))}
      </div>
      <button className="fc-arrow right" onClick={() => scroll(1)} aria-label="Siguiente">›</button>
    </div>
  );
}
