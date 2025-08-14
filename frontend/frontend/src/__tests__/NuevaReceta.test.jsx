import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/utils";
import * as recipesSvc from "../services/recipesService";

// usuario autenticado
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { nombre: "Ana" } }),
}));

// mock de creación
vi.spyOn(recipesSvc, "createRecipe").mockResolvedValue({
  id: "x1",
  titulo: "Tacos verdes",
});

test("publica receta con validación mínima", async () => {
  const { default: NuevaReceta } = await import("../pages/NuevaReceta.jsx");
  renderWithRouter(<NuevaReceta />);

  // título
  await userEvent.type(
    screen.getByPlaceholderText(/Ej\. Chilaquiles rojos/i),
    "Tacos verdes"
  );

  // categoría (toma el primer combobox de la pantalla)
  const selects = screen.getAllByRole("combobox");
  await userEvent.selectOptions(selects[0], "Tacos");

  // ingrediente y paso
  await userEvent.type(screen.getByPlaceholderText("Ingrediente *"), "Tortillas");
  await userEvent.type(screen.getByPlaceholderText("Paso 1 *"), "Calentar aceite");

  // enviar
  const btn = screen.getByRole("button", { name: /Publicar receta/i });
  await userEvent.click(btn);

  expect(recipesSvc.createRecipe).toHaveBeenCalled();
});
