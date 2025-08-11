// src/components/ModalReceta.jsx
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function ModalReceta({ receta, onClose }) {
  // Bloquea scroll y cierra con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="
        fixed inset-0 z-[1000]
        bg-black/60           /* overlay oscuro SIN opacity global ni blur */
      "
    >
      <div
        className="
          fixed z-[1001]
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[min(92vw,720px)] max-h-[85vh] overflow-y-auto
          bg-white bg-opacity-100  /* sólido sí o sí */
          rounded-2xl p-6 shadow-2xl animate-fade-in
          isolate                  /* crea nuevo stacking, evita efectos raros */
        "
        role="dialog"
        aria-modal="true"
        /* cinturón y tirantes: si algo pisa bg, esto lo fuerza sólido */
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-center mb-1">{receta.nombre}</h2>
        <p className="italic text-center text-gray-700 mb-3">{receta.descripcion}</p>

        <img
          src={receta.imagen}
          alt={receta.nombre}
          className="rounded-xl mx-auto mb-4 max-h-60 object-cover"
        />

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
          <p><strong>⏰ Tiempo:</strong> {receta.tiempo}</p>
          <p><strong>🍽️ Porciones:</strong> {receta.porciones}</p>
          <p><strong>📊 Dificultad:</strong> {receta.dificultad}</p>
          <p><strong>📂 Categoría:</strong> {receta.categoria}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1">Ingredientes 📝:</h3>
          <ul className="list-disc list-inside mb-4">
            {receta.ingredientes.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>

          <h3 className="font-semibold text-lg mb-1">Preparación 👨‍🍳:</h3>
          <p className="text-sm text-gray-800 whitespace-pre-line">{receta.preparacion}</p>

          {receta.notas && (
            <>
              <h3 className="font-semibold text-lg mt-4 mb-1">Notas ✨:</h3>
              <p className="text-sm text-gray-600 italic">{receta.notas}</p>
            </>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
