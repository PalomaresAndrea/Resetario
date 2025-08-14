import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithRouter } from "../test/utils";
import Inicio from "../components/inicio";
import * as svc from "../services/recipesService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.spyOn(svc, "fetchFeatured").mockResolvedValue([
  { id: "1", titulo: "Tacos", categoria: "Tacos", tiempo: "30m", emoji: "🌮" },
]);

test("carga destacadas y permite buscar", async () => {
  renderWithRouter(<Inicio />);
  await waitFor(() => expect(screen.getByText("Recetas destacadas")).toBeInTheDocument());

  const input = screen.getByLabelText("Buscar recetas");
  fireEvent.change(input, { target: { value: "pastel" } });
  fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

  expect(mockNavigate).toHaveBeenCalledWith("/recetas?q=pastel");
});
