import { render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Recetas from "../pages/Recetas";
import * as svc from "../services/recipesService";

vi.spyOn(svc, "fetchRecipes").mockResolvedValue([
  { id: "1", titulo: "Tacos", categoria: "Tacos", tiempo: "10m", autor: "A" },
  { id: "2", titulo: "Pasta", categoria: "Pasta", tiempo: "20m", autor: "B" },
]);

test("lista recetas", async () => {
  render(
    <MemoryRouter initialEntries={["/recetas"]}>
      <Recetas />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText("Tacos")).toBeInTheDocument());
});
