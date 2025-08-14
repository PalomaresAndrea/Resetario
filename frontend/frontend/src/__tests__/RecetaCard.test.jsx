import { render, screen, fireEvent } from "@testing-library/react";
import RecetaCard from "../components/RecetaCard.jsx";

vi.useFakeTimers();

test("invoca onOpen tras click", () => {
  const receta = {
    nombre: "Chilaquiles",
    descripcion: "Ricos",
    imagen: "x.jpg",
  };
  const onOpen = vi.fn();

  render(<RecetaCard receta={receta} onOpen={onOpen} />);

  // hace click en el título
  fireEvent.click(screen.getByText("Chilaquiles"));

  // el componente usa setTimeout de ~250ms
  vi.advanceTimersByTime(260);

  expect(onOpen).toHaveBeenCalledWith(receta);
});
