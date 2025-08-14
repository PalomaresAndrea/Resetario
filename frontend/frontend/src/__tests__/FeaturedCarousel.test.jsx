import { screen, fireEvent } from "@testing-library/react";
import { renderWithRouter } from "../test/utils";
import FeaturedCarousel from "../components/FeaturedCarousel";
import * as rrd from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const recipes = [
  { id: "1", titulo: "Tacos", categoria: "Tacos", tiempo: "30m", emoji: "🌮" },
  { id: "2", titulo: "Pasta", categoria: "Pasta", tiempo: "25m", emoji: "🍝" },
];

test("renderiza tarjetas y navega al hacer click", () => {
  renderWithRouter(<FeaturedCarousel recipes={recipes} />);
  expect(screen.getByText("Tacos")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Tacos").closest("button"));
  expect(mockNavigate).toHaveBeenCalledWith("/recetas?q=Tacos");
});

test("botones de flecha invocan scroll", () => {
  const spy = vi.spyOn(Element.prototype, "scrollBy");
  renderWithRouter(<FeaturedCarousel recipes={recipes} />);
  fireEvent.click(screen.getByLabelText("Siguiente"));
  expect(spy).toHaveBeenCalled();
});
