import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipesService";
import { useAuth } from "../context/AuthContext";
import "./NuevaReceta.css";

const CATEGORIAS = ["Tacos","Pasta","Postres","Ensaladas","Sopas","Sandwiches","Desayunos","Bebidas","Mariscos"];
const DIFICULTAD = ["Fácil","Media","Difícil"];

export default function NuevaReceta() {
  const { user } = useAuth();
  const nav = useNavigate();

  // Campos
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [porciones, setPorciones] = useState(2);
  const [historia, setHistoria] = useState("");

  // Ingredientes y pasos
  const [ingredientes, setIngredientes] = useState([{ qty:"", unit:"", name:"" }]);
  const [pasos, setPasos] = useState([""]);

  // Tags
  const [tagsTxt, setTagsTxt] = useState("");

  // Imagen
  const [preview, setPreview] = useState(null);
  const [fileErr, setFileErr] = useState("");

  // Estado UI
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // opcional: si no hay user, podrías redirigir; normalmente lo hace PrivateRoute
  }, [user]);

  const onSelectImg = (e) => {
    setFileErr("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) {
      setFileErr("El archivo debe ser una imagen.");
      return;
    }
    if (f.size > 3 * 1024 * 1024) { // 3MB
      setFileErr("La imagen no debe superar 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const addIng = () => setIngredientes([...ingredientes, { qty:"", unit:"", name:"" }]);
  const delIng = (i) => setIngredientes(ingredientes.filter((_,idx)=>idx!==i));
  const updIng = (i, key, val) => {
    const copy = ingredientes.slice();
    copy[i][key] = val;
    setIngredientes(copy);
  };

  const addPaso = () => setPasos([...pasos, ""]);
  const delPaso = (i) => setPasos(pasos.filter((_,idx)=>idx!==i));
  const updPaso = (i, val) => {
    const copy = pasos.slice();
    copy[i] = val;
    setPasos(copy);
  };

  const tags = useMemo(() =>
    tagsTxt.split(",").map(t=>t.trim()).filter(Boolean), [tagsTxt]);

  // Validación mínima
  const ingredientesOk = ingredientes.some(it => it.name.trim());
  const pasosOk = pasos.some(p => p.trim());
  const canSubmit = !!(
    titulo.trim() && categoria && ingredientesOk && pasosOk && !loading
  );

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!canSubmit) return;

    try {
      setLoading(true);
      const payload = {
        titulo: titulo.trim(),
        categoria,
        tiempo: tiempo.trim() || "",
        dificultad: dificultad || "",
        porciones: Number(porciones) || 1,
        historia: historia.trim(),
        ingredientes: ingredientes.filter(i=>i.name.trim()),
        pasos: pasos.filter(p=>p.trim()),
        tags,
        imagen: preview || null,
        autor: user?.nombre || "Anónimo",
      };
      const created = await createRecipe(payload);
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
        <p className="nr-sub">Comparte tu sazón con el mundo. <b>Tu receta, tu historia</b> ✨</p>

        <form className="nr-form" onSubmit={submit}>
          {/* Columna izquierda */}
          <div className="nr-col">
            <label className="lab">Título *</label>
            <input className="inp" placeholder="Ej. Chilaquiles rojos" value={titulo} onChange={e=>setTitulo(e.target.value)} />

            <div className="grid2">
              <div>
                <label className="lab">Categoría *</label>
                <select className="inp" value={categoria} onChange={e=>setCategoria(e.target.value)}>
                  <option value="">Selecciona...</option>
                  {CATEGORIAS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="lab">Tiempo</label>
                <input className="inp" placeholder="Ej. 35 min" value={tiempo} onChange={e=>setTiempo(e.target.value)} />
              </div>
            </div>

            <div className="grid2">
              <div>
                <label className="lab">Dificultad</label>
                <select className="inp" value={dificultad} onChange={e=>setDificultad(e.target.value)}>
                  <option value="">Selecciona...</option>
                  {DIFICULTAD.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="lab">Porciones</label>
                <input type="number" min={1} className="inp" value={porciones} onChange={e=>setPorciones(e.target.value)} />
              </div>
            </div>

            <label className="lab">Cuenta la historia de tu receta</label>
            <textarea className="inp" rows={4} placeholder="¿De dónde viene, qué la hace especial?"
              value={historia} onChange={e=>setHistoria(e.target.value)} />
          </div>

          {/* Columna derecha */}
          <div className="nr-col">
            <label className="lab">Imagen</label>
            <div className="uploader">
              {preview ? (
                <div className="preview">
                  <img src={preview} alt="preview" />
                  <button type="button" className="btn ghost" onClick={()=>setPreview(null)}>Quitar</button>
                </div>
              ) : (
                <label className="drop">
                  <input type="file" accept="image/*" onChange={onSelectImg} hidden />
                  <span>📷 Sube una foto (máx 3MB)</span>
                </label>
              )}
              {fileErr && <p className="err">{fileErr}</p>}
            </div>

            <label className="lab">Ingredientes *</label>
            <div className="list">
              {ingredientes.map((it, i)=>(
                <div key={i} className="row">
                  <input className="inp small" placeholder="Cant." value={it.qty} onChange={e=>updIng(i, "qty", e.target.value)} />
                  <input className="inp small" placeholder="Unidad" value={it.unit} onChange={e=>updIng(i, "unit", e.target.value)} />
                  <input className="inp" placeholder="Ingrediente *" value={it.name} onChange={e=>updIng(i, "name", e.target.value)} />
                  <button type="button" className="btn ghost danger" onClick={()=>delIng(i)}>✕</button>
                </div>
              ))}
              <button type="button" className="btn add" onClick={addIng}>+ Añadir ingrediente</button>
            </div>

            <label className="lab">Pasos *</label>
            <div className="list">
              {pasos.map((p, i)=>(
                <div key={i} className="row">
                  <textarea className="inp" rows={2} placeholder={`Paso ${i+1} *`} value={p} onChange={e=>updPaso(i, e.target.value)} />
                  <button type="button" className="btn ghost danger" onClick={()=>delPaso(i)}>✕</button>
                </div>
              ))}
              <button type="button" className="btn add" onClick={addPaso}>+ Añadir paso</button>
            </div>

            <label className="lab">Etiquetas</label>
            <input className="inp" placeholder="separa con comas (ej. picante, vegano)" value={tagsTxt} onChange={e=>setTagsTxt(e.target.value)} />
          </div>

          {err && <p className="err" style={{gridColumn:"1 / -1"}}>{err}</p>}

          <div className="actions">
            <button type="button" className="btn ghost" onClick={()=>nav(-1)}>Cancelar</button>
            <button className={`btn primary ${!canSubmit ? "disabled":""}`} disabled={!canSubmit || loading}>
              {loading ? "Publicando..." : "Publicar receta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
