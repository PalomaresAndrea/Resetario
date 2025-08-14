import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/utils";

// Mock del hook de auth para que Navbar no falle
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

import App from "../App";

test("renderiza Navbar", () => {
  renderWithRouter(<App />);
  expect(screen.getByText(/K-Recetas/i)).toBeInTheDocument();
});
