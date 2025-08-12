// Servicio MOCK para recetas (luego lo cambias por axios a tu API)
const WAIT = (ms = 350) => new Promise(r => setTimeout(r, ms));
const LS_USER_RECIPES = "mock_user_recipes";

// Seed de ejemplo (recetas públicas)
const RECETAS_BASE = [
  { id: "r1", titulo: "Tacos al pastor", categoria: "Tacos", tags:["cerdo","piña"], tiempo:"30 min", dificultad:"Fácil", porciones:4, autor:"Ana", emoji:"🌮" },
  { id: "r2", titulo: "Pasta Alfredo", categoria: "Pasta", tags:["pollo","crema"], tiempo:"25 min", dificultad:"Media", porciones:2, autor:"Luis", emoji:"🍝" },
  { id: "r3", titulo: "Cheesecake de fresa", categoria: "Postres", tags:["fresa","queso"], tiempo:"3 h", dificultad:"Media", porciones:8, autor:"Majo", emoji:"🍰" },
  { id: "r4", titulo: "Ensalada César", categoria: "Ensaladas", tags:["pollo","lechuga"], tiempo:"15 min", dificultad:"Fácil", porciones:2, autor:"Karla", emoji:"🥗" },
  { id: "r5", titulo: "Ramen casero", categoria: "Sopas", tags:["puerco","huevo"], tiempo:"1 h", dificultad:"Difícil", porciones:2, autor:"Ito", emoji:"🍜" },
  { id: "r6", titulo: "Sandwich club", categoria: "Sandwiches", tags:["pavo","tocino"], tiempo:"12 min", dificultad:"Fácil", porciones:1, autor:"Pau", emoji:"🥪" },
];

const CAT_EMOJI = {
  "Tacos":"🌮","Pasta":"🍝","Postres":"🍰","Ensaladas":"🥗","Sopas":"🍜","Sandwiches":"🥪","Desayunos":"🍳","Bebidas":"🥤","Mariscos":"🦐"
};

function loadUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER_RECIPES)) || []; }
  catch { return []; }
}
function saveUser(arr) {
  localStorage.setItem(LS_USER_RECIPES, JSON.stringify(arr));
}

export async function fetchRecipes() {
  await WAIT();
  return [...RECETAS_BASE, ...loadUser()];
}

export async function fetchFeatured() {
  await WAIT();
  const all = await fetchRecipes();
  return all.slice(0, 5);
}

/**
 * createRecipe(payload)
 * payload: {
 *  titulo, categoria, tiempo, dificultad, porciones, historia,
 *  ingredientes: [{ qty, unit, name }],
 *  pasos: [string],
 *  tags: [string],
 *  imagen: dataURL | null,
 *  autor: string
 * }
 */
export async function createRecipe(payload) {
  await WAIT(500);
  const id = `u_${Date.now()}`;
  const emoji = CAT_EMOJI[payload.categoria?.trim()] || "🍽️";
  const item = {
    id,
    emoji,
    ...payload,
  };
  const list = loadUser();
  list.unshift(item);
  saveUser(list);
  return item;
}
