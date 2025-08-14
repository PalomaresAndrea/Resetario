import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById } from "../services/recipesService";
import "./Receta.css";

export default function Receta() {
  const { id } = useParams();
  const nav = useNavigate();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    setLoading(true);
    getRecipeById(id).then(data => { setR(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="receta-wrap"><p className="muted">Cargando…</p></div>;
  if (!r) return <div className="receta-wrap"><p className="muted">No encontramos esta receta.</p></div>;

  return (
    <div className="receta-wrap">
      <article className="receta-card">
        <header className="receta-header">
          <div className="receta-thumb">
            {r.imagen ? <img src={r.imagen} alt={r.titulo} /> : <span className="big-emoji">{r.emoji || "🍽️"}</span>}
          </div>
          <div className="receta-headinfo">
            <h1 className="receta-title">{r.titulo}</h1>
            <p className="receta-meta">
              {r.categoria} • {r.tiempo || "—"} {r.dificultad ? `• ${r.dificultad}` : ""} • por {r.autor || "Anónimo"}
            </p>
            <div className="receta-tags">
              {(r.tags||[]).map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
            <div className="receta-actions">
              <button className="btn ghost" onClick={()=>nav(-1)}>Volver</button>
              <button className="btn primary" onClick={()=>nav(`/nueva?clonarId=${r.id}`)}>
                Clonar y editar
              </button>
            </div>
          </div>
        </header>

        {r.historia && (
          <section className="receta-section">
            <h2>La historia</h2>
            <p className="receta-text">{r.historia}</p>
          </section>
        )}

        <section className="receta-section grid2">
          <div>
            <h2>Ingredientes</h2>
            <ul className="list">
              {(r.ingredientes||[]).map((i,idx)=>(
                <li key={idx}>{[i.qty,i.unit,i.name].filter(Boolean).join(" ")}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Pasos</h2>
            <ol className="list">
              {(r.pasos||[]).map((p,idx)=> <li key={idx}>{p}</li>)}
            </ol>
          </div>
        </section>
      </article>
    </div>
  );
}
