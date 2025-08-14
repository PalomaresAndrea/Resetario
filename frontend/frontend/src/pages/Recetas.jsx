import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Recetas.css";
import { fetchRecipes } from "../services/recipesService";

export default function Recetas() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const qParam = params.get("q") || "";
  const catParam = params.get("cat") || "";

  const [q, setQ] = useState(qParam);
  useEffect(() => setQ(qParam), [qParam]);

  useEffect(() => {
    setLoading(true);
    fetchRecipes().then((r) => {
      setAll(r);
      setLoading(false);
    });
  }, []);

  const categorias = ["Tacos", "Pasta", "Postres", "Ensaladas", "Sopas", "Sandwiches"];

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return all.filter((r) => {
      const matchQ =
        !term ||
        r.titulo.toLowerCase().includes(term) ||
        r.tags?.some((t) => t.toLowerCase().includes(term));
      const matchC = !catParam || r.categoria === catParam;
      return matchQ && matchC;
    });
  }, [all, q, catParam]);

  const applySearch = (e) => {
    e?.preventDefault();
    const next = new URLSearchParams(params);
    q ? next.set("q", q) : next.delete("q");
    setParams(next, { replace: true });
  };

  const setCat = (cat) => {
    const next = new URLSearchParams(params);
    if (cat && cat !== catParam) next.set("cat", cat);
    else next.delete("cat");
    setParams(next, { replace: true });
  };

  return (
    <div className="recetas-bg">
      <div className="recetas">
        <h1 className="recetas-title">Recetas</h1>

        {/* Buscador */}
        <form className="recetas-search" onSubmit={applySearch}>
          <input
            placeholder="Buscar por ingrediente o nombre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="r-btn r-primary">Buscar</button>
        </form>

        {/* Filtros */}
        <div className="recetas-chips">
          {categorias.map((c) => (
            <button
              key={c}
              className={`r-chip ${catParam === c ? "active" : ""}`}
              onClick={() => setCat(c === catParam ? "" : c)}
            >
              {c}
            </button>
          ))}
          {(qParam || catParam) && (
            <button
              className="r-clear"
              onClick={() => {
                setParams({});
                setQ("");
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Lista */}
        {loading ? (
          <p className="muted">Cargando recetas…</p>
        ) : filtered.length === 0 ? (
          <p className="muted">No encontramos recetas con esos criterios.</p>
        ) : (
          <ul className="grid">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="card"
                onClick={() => nav(`/receta/${r.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="thumb">{r.emoji || "🍽️"}</div>
                <div className="info">
                  <h3>{r.titulo}</h3>
                  <p className="meta">
                    {r.categoria} • {r.tiempo} • por {r.autor}
                  </p>
                  <div className="tags">
                    {(r.tags || []).map((t) => (
                      <span key={t} className="tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="more"
                  onClick={(e) => {
                    e.stopPropagation();
                    nav(`/recetas?q=${encodeURIComponent(r.titulo)}`);
                  }}
                >
                  Ver similares
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
