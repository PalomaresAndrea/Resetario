import { Routes, Route, MemoryRouter } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import Receta from "../pages/Receta";
import * as svc from "../services/recipesService";

vi.spyOn(svc, "getRecipeById").mockResolvedValue({
  id: "r1",
  titulo: "Tacos",
  categoria: "Tacos",
  pasos: ["A", "B"],
  ingredientes: [{ name: "Tortilla" }],
});

test("muestra receta por id", async () => {
  render(
    <MemoryRouter initialEntries={["/receta/r1"]}>
      <Routes>
        <Route path="/receta/:id" element={<Receta />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.getByText("Tacos")).toBeInTheDocument());
});
