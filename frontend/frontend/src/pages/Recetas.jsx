// src/pages/Recetas.jsx
import { useState } from "react";
import RecetaCard from "../components/RecetaCard";
import ModalReceta from "../components/ModalReceta";
import bibimbap from "../assets/bibimbap.jpeg";
import topokki from "../assets/topokki.jpeg";

export default function Recetas() {
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  const recetas = [
    {
      nombre: "Bibimbap",
      descripcion: "Platillo coreano con arroz, vegetales y huevo 🍳",
      imagen: bibimbap,
      ingredientes: ["Arroz", "Zanahoria", "Huevo", "Espinaca", "Gochujang"],
      preparacion:
        "Mezcla todos los ingredientes sobre arroz caliente y sirve con gochujang al gusto.",
      tiempo: "30 minutos",
      porciones: "2",
      dificultad: "Media",
      categoria: "Plato principal",
      notas: "Puedes acompañar con carne de res marinada para hacerlo más completo.",
    },
    {
      nombre: "Tteokbokki",
      descripcion: "Pastelitos de arroz picantes con salsa gochujang 🌶️",
      imagen: topokki,
      ingredientes: ["Tteok", "Gochujang", "Ajo", "Cebolla", "Azúcar"],
      preparacion:
        "Cocina todos los ingredientes en una sartén hasta que la salsa espese.",
      tiempo: "25 minutos",
      porciones: "2",
      dificultad: "Fácil",
      categoria: "Snack",
      notas: "Ajusta el nivel de picante según tu gusto.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
      {/* contenedor centrado con el mismo ancho del modal */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-10">
          Mis Recetas Favoritas <span className="text-pink-500">💕</span>
        </h1>

        <div className="flex flex-col gap-8 items-center">
          {recetas.map((receta) => (
            <RecetaCard
              key={receta.nombre}
              receta={receta}
              onOpen={() => setRecetaSeleccionada(receta)}
            />
          ))}
        </div>
      </div>

      {recetaSeleccionada && (
        <ModalReceta
          receta={recetaSeleccionada}
          onClose={() => setRecetaSeleccionada(null)}
        />
      )}
    </div>
  );
}
