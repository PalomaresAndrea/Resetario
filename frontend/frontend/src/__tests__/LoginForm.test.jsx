import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../components/LoginForm";

// Simulamos un estado de usuario en el mock del contexto
let mockUser = null;
const doLoginMock = vi.fn().mockImplementation(async () => {
  // tras login exitoso, el contexto tendría un usuario
  mockUser = { id: "u1", email: "a@a.com", name: "Test" };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ doLogin: doLoginMock, user: mockUser }),
}));

// Mock de navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
}); // 👈 corregido: sólo "});" (sin paréntesis extra)

test("hace login y navega a /nueva", async () => {
  const { rerender } = render(<LoginForm />);

  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Correo/i), "a@a.com");
  await user.type(screen.getByLabelText(/Contraseña/i), "Secret123!");
  await user.click(screen.getByRole("button", { name: /Entrar/i }));

  // Se llamó el login con las credenciales correctas
  await waitFor(() =>
    expect(doLoginMock).toHaveBeenCalledWith("a@a.com", "Secret123!")
  );

  // Simula que el contexto ya tiene user → disparamos el useEffect re-renderizando
  rerender(<LoginForm />);

  // La navegación puede ser nav("/nueva") o nav("/nueva", { replace: true })
  await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  const calls = mockNavigate.mock.calls;
  const fueANueva = calls.some((args) => args[0] === "/nueva");
  expect(fueANueva).toBe(true);
});
