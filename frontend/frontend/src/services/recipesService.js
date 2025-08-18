import api from "./api";

const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK || "false").toLowerCase() === "true";

const WAIT = (ms = 350) => new Promise(r => setTimeout(r, ms));
const LS_KEY = "mock_user_recipes";

const CAT_EMOJI = {
  Tacos:"🌮", Pasta:"🍝", Postres:"🍰", Ensaladas:"🥗", Sopas:"🍜", Sandwiches:"🥪",
  Desayunos:"🍳", Bebidas:"🥤", Mariscos:"🦐"
};

const RECETAS_BASE = [
  {
    id:"r1", titulo:"Tacos al pastor", categoria:"Tacos", tiempo:"30 min",
    dificultad:"Fácil", porciones:4, autor:"Ana", emoji:"🌮", tags:["cerdo","piña"],
    historia:"Receta callejera clásica de la CDMX. Me la pasó mi tío del mercado.",
    ingredientes:[
      { qty:"500", unit:"g", name:"carne de cerdo adobada" },
      { qty:"1", unit:"taza", name:"piña en cubos" },
      { qty:"1/2", unit:"", name:"cebolla blanca picada" },
      { qty:"1", unit:"puñado", name:"cilantro picado" },
      { qty:"8", unit:"", name:"tortillas de maíz" },
      { qty:"al gusto", unit:"", name:"limón y sal" },
    ],
    pasos:[
      "Cocina el cerdo adobado a fuego medio hasta dorar.",
      "Calienta las tortillas.",
      "Arma los tacos con carne, piña, cebolla y cilantro.",
      "Sirve con limón y sal."
    ],
  },
  {
    id:"r2", titulo:"Pasta Alfredo", categoria:"Pasta", tiempo:"25 min",
    dificultad:"Media", porciones:2, autor:"Luis", emoji:"🍝", tags:["pollo","crema"],
    historia:"La clásica cremosa de días de antojo.",
    ingredientes:[
      { qty:"250", unit:"g", name:"pasta (fettuccine)" },
      { qty:"2", unit:"cda", name:"mantequilla" },
      { qty:"1", unit:"diente", name:"ajo picado" },
      { qty:"1", unit:"taza", name:"crema para cocinar" },
      { qty:"1/2", unit:"taza", name:"queso parmesano rallado" },
      { qty:"al gusto", unit:"", name:"sal y pimienta" },
    ],
    pasos:[
      "Cuece la pasta al dente.",
      "Derrite mantequilla y saltea el ajo.",
      "Agrega la crema y el parmesano hasta espesar.",
      "Mezcla con la pasta y ajusta sal/pimienta."
    ],
  },
  {
    id:"r3", titulo:"Cheesecake de fresa", categoria:"Postres", tiempo:"3 h",
    dificultad:"Media", porciones:8, autor:"Majo", emoji:"🍰", tags:["fresa","queso"],
    historia:"Postre favorito de los cumples en casa.",
    ingredientes:[
      { qty:"200", unit:"g", name:"galletas María" },
      { qty:"80", unit:"g", name:"mantequilla derretida" },
      { qty:"600", unit:"g", name:"queso crema" },
      { qty:"150", unit:"g", name:"azúcar" },
      { qty:"3", unit:"", name:"huevos" },
      { qty:"300", unit:"g", name:"fresas" },
      { qty:"1/2", unit:"taza", name:"mermelada de fresa" },
    ],
    pasos:[
      "Tritura galletas y mezcla con mantequilla para la base.",
      "Bate queso, azúcar y huevos; vierte sobre la base.",
      "Hornea ~45 min y enfría.",
      "Cubre con fresas y mermelada."
    ],
  },
];

// ---- helpers localStorage (mock) ----
function loadUser() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}
function saveUser(arr) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }

// ====== API REAL ======
async function apiFetchRecipes() {
  const { data } = await api.get("/recipes");
  return data;
}
async function apiGetRecipeById(id) {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
}
async function apiCreateRecipe(payload) {
  // Construimos FormData (NO enviar Base64 en JSON)
  const fd = new FormData();
  fd.append("titulo", payload.titulo || "");
  fd.append("categoria", payload.categoria || "");
  fd.append("tiempo", payload.tiempo || "");
  fd.append("dificultad", payload.dificultad || "");
  if (payload.porciones != null) fd.append("porciones", String(payload.porciones));
  if (payload.historia) fd.append("historia", payload.historia);

  (payload.ingredientes || []).forEach((ing) => fd.append("ingredientes[]", JSON.stringify(ing)));
  (payload.pasos || []).forEach((p) => fd.append("pasos[]", p));

  const tags = payload.tagsTxt
    ? payload.tagsTxt.split(",").map(t => t.trim()).filter(Boolean)
    : (payload.tags || []);
  tags.forEach((t) => fd.append("tags[]", t));

  // Imagen: prioriza File; si no hay, puedes mandar imagenUrl
  if (payload.imagenFile instanceof File) {
    fd.append("imagen", payload.imagenFile);
  } else if (payload.imagenUrl) {
    fd.append("imagenUrl", payload.imagenUrl);
  }

  const { data } = await api.post("/recipes", fd); // Axios setea el boundary automáticamente
  return data;
}

// ====== MOCK FALLBACK ======
async function mockFetchRecipes() {
  await WAIT();
  return [...RECETAS_BASE, ...loadUser()];
}
async function mockGetRecipeById(id) {
  const all = await mockFetchRecipes();
  return all.find(r => r.id === id) || null;
}
async function mockCreateRecipe(payload) {
  await WAIT(500);
  const id = `u_${Date.now()}`;
  const emoji = CAT_EMOJI[payload.categoria?.trim()] || "🍽️";
  const item = { id, createdAt:new Date().toISOString(), emoji, ...payload };
  const list = loadUser();
  list.unshift(item);
  saveUser(list);
  return item;
}

// ====== API PÚBLICA PARA EL UI ======
export async function fetchRecipes() {
  if (USE_MOCK) return mockFetchRecipes();
  try { return await apiFetchRecipes(); }
  catch { return mockFetchRecipes(); }
}

export async function fetchFeatured() {
  const all = await fetchRecipes();
  return all.slice(0, 5);
}

export async function getRecipeById(id) {
  if (USE_MOCK) return mockGetRecipeById(id);
  try { return await apiGetRecipeById(id); }
  catch { return mockGetRecipeById(id); }
}

export async function createRecipe(payload) {
  if (USE_MOCK) return mockCreateRecipe(payload);
  // No hacemos fallback silencioso aquí para no "simular" guardado si falla el backend.
  return apiCreateRecipe(payload);
}

// Para precargar formulario al "clonar y editar"
export function mapRecipeToFormValues(r) {
  if (!r) return null;
  return {
    titulo: r.titulo || "",
    categoria: r.categoria || "",
    tiempo: r.tiempo || "",
    dificultad: r.dificultad || "",
    porciones: r.porciones || 2,
    historia: r.historia || "",
    ingredientes: r.ingredientes?.length ? r.ingredientes : [{ qty:"", unit:"", name:"" }],
    pasos: r.pasos?.length ? r.pasos : [""],
    tagsTxt: r.tags?.length ? r.tags.join(", ") : "",
    preview: r.imagen || null,
    imagenFile: null, // aquí guardas el File del <input type="file">
  };
}
