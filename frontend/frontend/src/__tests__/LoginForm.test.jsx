import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../components/LoginForm";

// Mock de AuthContext con un mock reutilizable
const doLoginMock = vi.fn().mockResolvedValue({});
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ doLogin: doLoginMock, user: null }),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

test("hace login y navega a /nueva", async () => {
  render(<LoginForm />);

  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Correo/i), "a@a.com");
  await user.type(screen.getByLabelText(/Contraseña/i), "Secret123!");
  await user.click(screen.getByRole("button", { name: /Entrar/i }));

  // Se llamó doLogin con credenciales correctas
  expect(doLoginMock).toHaveBeenCalledWith("a@a.com", "Secret123!");

  // La navegación es asíncrona: espera a que ocurra
  await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

  // Acepta nav("/nueva") o nav("/nueva", { replace: true })
  const calls = mockNavigate.mock.calls;
  const fueANueva = calls.some(
    (args) => args[0] === "/nueva"
  );
  expect(fueANueva).toBe(true);
});
