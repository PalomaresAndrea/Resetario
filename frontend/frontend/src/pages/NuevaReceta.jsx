import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createRecipe,
  getRecipeById,
  mapRecipeToFormValues,
} from "../services/recipesService";
import { useAuth } from "../context/AuthContext";
import "./NuevaReceta.css";

const CATEGORIAS = [
  "Tacos",
  "Pasta",
  "Postres",
  "Ensaladas",
  "Sopas",
  "Sandwiches",
  "Desayunos",
  "Bebidas",
  "Mariscos",
];
const DIFICULTAD = ["Fácil", "Media", "Difícil"];
const UNIDADES_SUG = ["g", "kg", "ml", "l", "taza", "cda", "cdta", "pza", "al gusto"];
const DRAFT_KEY = "draft_new_recipe";
const HIST_MAX = 400;

export default function NuevaReceta() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [search] = useSearchParams();
  const clonarId = search.get("clonarId");

  // Campos
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [porciones, setPorciones] = useState(2);
  const [historia, setHistoria] = useState("");

  // Ingredientes y pasos
  const [ingredientes, setIngredientes] = useState([{ qty: "", unit: "", name: "" }]);
  const [pasos, setPasos] = useState([""]);

  // Tags
  const [tagsTxt, setTagsTxt] = useState("");

  // Imagen
  const [preview, setPreview] = useState(null);
  const [fileErr, setFileErr] = useState("");

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [errors, setErrors] = useState({}); // por campo

  const dropRef = useRef(null);

  // Precargar si venimos de "clonar y editar" o de borrador
  useEffect(() => {
    (async () => {
      if (clonarId) {
        try {
          const data = await getRecipeById(clonarId);
          const m = mapRecipeToFormValues(data);
          if (m) {
            setTitulo(m.titulo);
            setCategoria(m.categoria);
            setTiempo(m.tiempo);
            setDificultad(m.dificultad);
            setPorciones(m.porciones);
            setHistoria(m.historia);
            setIngredientes(m.ingredientes);
            setPasos(m.pasos);
            setTagsTxt(m.tagsTxt);
            setPreview(m.preview);
            return;
          }
        } catch {}
      }
      // Si no clonamos, intenta cargar borrador
      try {
        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
        if (draft) {
          setTitulo(draft.titulo || "");
          setCategoria(draft.categoria || "");
          setTiempo(draft.tiempo || "");
          setDificultad(draft.dificultad || "");
          setPorciones(draft.porciones || 2);
          setHistoria(draft.historia || "");
          setIngredientes(draft.ingredientes?.length ? draft.ingredientes : [{ qty:"", unit:"", name:"" }]);
          setPasos(draft.pasos?.length ? draft.pasos : [""]);
          setTagsTxt(draft.tagsTxt || "");
          setPreview(draft.preview || null);
        }
      } catch {}
    })();
  }, [clonarId]);

  // Guardado automático de borrador
  useEffect(() => {
    const payload = {
      titulo,
      categoria,
      tiempo,
      dificultad,
      porciones,
      historia,
      ingredientes,
      pasos,
      tagsTxt,
      preview,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  }, [titulo, categoria, tiempo, dificultad, porciones, historia, ingredientes, pasos, tagsTxt, preview]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setErr("");
  };

  // Imagen: file & drag&drop
  const onSelectImg = (f) => {
    setFileErr("");
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      setFileErr("El archivo debe ser una imagen.");
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setFileErr("La imagen no debe superar 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };
  const onInputFile = (e) => onSelectImg(e.target.files?.[0]);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const prevent = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
    const over = (ev) => { prevent(ev); el.classList.add("dragover"); };
    const leave = (ev) => { prevent(ev); el.classList.remove("dragover"); };
    const drop = (ev) => {
      prevent(ev);
      el.classList.remove("dragover");
      const f = ev.dataTransfer?.files?.[0];
      onSelectImg(f);
    };

    ["dragenter", "dragover"].forEach((t) => el.addEventListener(t, over));
    ["dragleave", "dragend"].forEach((t) => el.addEventListener(t, leave));
    el.addEventListener("drop", drop);

    return () => {
      ["dragenter", "dragover"].forEach((t) => el.removeEventListener(t, over));
      ["dragleave", "dragend"].forEach((t) => el.removeEventListener(t, leave));
      el.removeEventListener("drop", drop);
    };
  }, []);

  // Helpers ingredientes/pasos
  const addIng = () =>
    setIngredientes([...ingredientes, { qty: "", unit: "", name: "" }]);
  const delIng = (i) =>
    setIngredientes(ingredientes.filter((_, idx) => idx !== i));
  const updIng = (i, key, val) => {
    const copy = ingredientes.slice();
    copy[i][key] = val;
    setIngredientes(copy);
  };

  const addPaso = () => setPasos([...pasos, ""]);
  const delPaso = (i) => setPasos(pasos.filter((_, idx) => idx !== i));
  const updPaso = (i, val) => {
    const copy = pasos.slice();
    copy[i] = val;
    setPasos(copy);
  };

  const onIngKey = (e, i, key) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIng();
    }
    // Ctrl+Backspace en vacío -> elimina fila (si hay más de una)
    if (e.ctrlKey && e.key === "Backspace" && !ingredientes[i][key]) {
      if (ingredientes.length > 1) {
        e.preventDefault();
        delIng(i);
      }
    }
  };

  const onPasoKey = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPaso();
    }
    if (e.ctrlKey && e.key === "Backspace" && !pasos[i] && pasos.length > 1) {
      e.preventDefault();
      delPaso(i);
    }
  };

  const tags = useMemo(
    () => tagsTxt.split(",").map((t) => t.trim()).filter(Boolean),
    [tagsTxt]
  );

  // Validación simple
  const ingredientesOk = ingredientes.some((it) => it.name.trim());
  const pasosOk = pasos.some((p) => p.trim());
  const canSubmit = !!(titulo.trim() && categoria && ingredientesOk && pasosOk && !loading);

  const validate = () => {
    const e = {};
    if (!titulo.trim()) e.titulo = "El título es obligatorio";
    if (!categoria) e.categoria = "Selecciona una categoría";
    if (!ingredientesOk) e.ingredientes = "Agrega al menos un ingrediente";
    if (!pasosOk) e.pasos = "Agrega al menos un paso";
    if (historia.length > HIST_MAX) e.historia = `Máximo ${HIST_MAX} caracteres`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setErr("");
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        titulo: titulo.trim(),
        categoria,
        tiempo: tiempo.trim() || "",
        dificultad: dificultad || "",
        porciones: Number(porciones) || 1,
        historia: historia.trim(),
        ingredientes: ingredientes.filter((i) => i.name.trim()),
        pasos: pasos.filter((p) => p.trim()),
        tags,
        imagen: preview || null,
        autor: user?.nombre || "Anónimo",
      };
      const created = await createRecipe(payload);
      localStorage.removeItem(DRAFT_KEY);
      alert("🍽️ ¡Receta publicada!");
      nav(`/recetas?q=${encodeURIComponent(created.titulo)}`, { replace: true });
    } catch {
      setErr("No se pudo guardar la receta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nr-wrap">
      <div className="nr-card">
        <h1 className="nr-title">Subir nueva receta</h1>
        <p className="nr-sub">
          Comparte tu sazón con el mundo. <b>Tu receta, tu historia</b> ✨
        </p>

        <form className="nr-form" onSubmit={submit}>
          {/* Columna izquierda */}
          <div className="nr-col">
            <label className="lab">Título *</label>
            <input
              className={`inp ${errors.titulo ? "inp-error" : ""}`}
              placeholder="Ej. Chilaquiles rojos"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={validate}
            />
            {errors.titulo && <p className="err">{errors.titulo}</p>}

            <div className="grid2">
              <div>
                <label className="lab">Categoría *</label>
                <select
                  className={`inp ${errors.categoria ? "inp-error" : ""}`}
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  onBlur={validate}
                >
                  <option value="">Selecciona...</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.categoria && <p className="err">{errors.categoria}</p>}
              </div>
              <div>
                <label className="lab">Tiempo</label>
                <input
                  className="inp"
                  placeholder="Ej. 35 min"
                  value={tiempo}
                  onChange={(e) => setTiempo(e.target.value)}
                />
              </div>
            </div>

            <div className="grid2">
              <div>
                <label className="lab">Dificultad</label>
                <select
                  className="inp"
                  value={dificultad}
                  onChange={(e) => setDificultad(e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  {DIFICULTAD.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="lab">Porciones</label>
                <input
                  type="number"
                  min={1}
                  className="inp"
                  value={porciones}
                  onChange={(e) => setPorciones(e.target.value)}
                />
              </div>
            </div>

            <label className="lab">
              Cuenta la historia de tu receta{" "}
              <span className="muted">({historia.length}/{HIST_MAX})</span>
            </label>
            <textarea
              className={`inp ${errors.historia ? "inp-error" : ""}`}
              rows={4}
              maxLength={HIST_MAX + 1}
              placeholder="¿De dónde viene, qué la hace especial?"
              value={historia}
              onChange={(e) => setHistoria(e.target.value)}
              onBlur={validate}
            />
            {errors.historia && <p className="err">{errors.historia}</p>}
          </div>

          {/* Columna derecha */}
          <div className="nr-col">
            <label className="lab">Imagen</label>
            <div className="uploader">
              {preview ? (
                <div className="preview">
                  <img src={preview} alt="preview" />
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setPreview(null)}
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <label className="drop" ref={dropRef}>
                  <input type="file" accept="image/*" onChange={onInputFile} hidden />
                  <span>📷 Sube una foto (máx 3MB) o arrástrala aquí</span>
                </label>
              )}
              {fileErr && <p className="err">{fileErr}</p>}
            </div>

            {/* Secciones a ancho completo */}
            <div className="section full">
              <h3 className="section-title">Ingredientes *</h3>
              {errors.ingredientes && <p className="err">{errors.ingredientes}</p>}
              <div className="list">
                {ingredientes.map((it, i) => (
                  <div key={i} className="row">
                    <input
                      className="inp small"
                      placeholder="Cant."
                      value={it.qty}
                      onChange={(e) => updIng(i, "qty", e.target.value)}
                      onKeyDown={(e) => onIngKey(e, i, "qty")}
                    />
                    <input
                      className="inp small"
                      list="unidades"
                      placeholder="Unidad"
                      value={it.unit}
                      onChange={(e) => updIng(i, "unit", e.target.value)}
                      onKeyDown={(e) => onIngKey(e, i, "unit")}
                    />
                    <datalist id="unidades">
                      {UNIDADES_SUG.map((u) => (
                        <option key={u} value={u} />
                      ))}
                    </datalist>
                    <input
                      className="inp"
                      placeholder="Ingrediente *"
                      value={it.name}
                      onChange={(e) => updIng(i, "name", e.target.value)}
                      onKeyDown={(e) => onIngKey(e, i, "name")}
                      onBlur={validate}
                    />
                    <button
                      type="button"
                      className="btn ghost danger"
                      onClick={() => delIng(i)}
                      aria-label="Quitar"
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="btn add" onClick={addIng}>
                  + Añadir ingrediente
                </button>
              </div>
            </div>

            <div className="section full">
              <h3 className="section-title">Pasos *</h3>
              {errors.pasos && <p className="err">{errors.pasos}</p>}
              <div className="list">
                {pasos.map((p, i) => (
                  <div key={i} className="row">
                    <textarea
                      className="inp"
                      rows={2}
                      placeholder={`Paso ${i + 1} *`}
                      value={p}
                      onChange={(e) => updPaso(i, e.target.value)}
                      onKeyDown={(e) => onPasoKey(e, i)}
                      onBlur={validate}
                    />
                    <button
                      type="button"
                      className="btn ghost danger"
                      onClick={() => delPaso(i)}
                      aria-label="Quitar"
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="btn add" onClick={addPaso}>
                  + Añadir paso
                </button>
              </div>
            </div>

            <div className="section full">
              <h3 className="section-title">Etiquetas</h3>
              <input
                className="inp"
                placeholder="separa con comas (ej. picante, vegano)"
                value={tagsTxt}
                onChange={(e) => setTagsTxt(e.target.value)}
              />
              {tags.length > 0 && (
                <div className="chips-preview">
                  {tags.map((t) => (
                    <span className="chip" key={t}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {err && <p className="err" style={{ gridColumn: "1 / -1" }}>{err}</p>}

          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => nav(-1)}>
              Cancelar
            </button>
            <button type="button" className="btn ghost" onClick={clearDraft}>
              Limpiar borrador
            </button>
            <button
              className={`btn primary ${!canSubmit ? "disabled" : ""}`}
              disabled={!canSubmit || loading}
            >
              {loading ? "Publicando..." : "Publicar receta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
