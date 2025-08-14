import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/utils";

afterEach(() => {
  vi.resetModules(); // permite re-mockear el mismo módulo entre tests
});

// Caso 1: sin usuario muestra Login/Registro
test("muestra login y registro si no hay usuario", async () => {
  vi.doMock("../context/AuthContext", () => ({
    useAuth: () => ({ user: null, logout: vi.fn() }),
  }));
  const { default: Navbar } = await import("../components/Navbar.jsx");
  renderWithRouter(<Navbar />);
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
  expect(screen.getByText(/Registro/i)).toBeInTheDocument();
});

// Caso 2: con usuario muestra Salir
test("muestra Salir si hay usuario", async () => {
  vi.doMock("../context/AuthContext", () => ({
    useAuth: () => ({ user: { nombre: "Ana" }, logout: vi.fn() }),
  }));
  const { default: Navbar } = await import("../components/Navbar.jsx");
  renderWithRouter(<Navbar />);
  expect(screen.getByText("Salir")).toBeInTheDocument();
});
