// src/components/RecetaCard.jsx
import { FaSearch } from "react-icons/fa";
import { useRef } from "react";

export default function RecetaCard({ receta, onOpen }) {
  const cardRef = useRef(null);

  const handleClick = () => {
    // centra la tarjeta en la pantalla
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // abre el modal un poco después para que la animación sea linda
    setTimeout(() => onOpen(receta), 250);
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row items-center gap-4 p-4 transition hover:scale-105 hover:shadow-xl cursor-pointer w-full max-w-3xl mx-auto"
      onClick={handleClick}
    >
      <img
        src={receta.imagen}
        alt={receta.nombre}
        className="w-28 h-28 object-cover rounded-lg"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold">{receta.nombre}</h3>
        <p className="text-gray-600 text-sm">{receta.descripcion}</p>
      </div>
      <FaSearch className="text-pink-600 text-xl hover:scale-125 transition-transform" />
    </div>
  );
}
