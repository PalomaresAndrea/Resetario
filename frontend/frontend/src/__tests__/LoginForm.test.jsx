// src/__tests__/LoginForm.test.jsx
import { vi, beforeEach, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// --- HOISTED mocks (seguros con Vitest) ---
const { state, doLoginMock, mockNavigate } = vi.hoisted(() => {
  const state = { user: null };
  const doLoginMock = vi.fn(async (email, password) => {
    // Simula login exitoso y "login" del contexto
    state.user = { id: "u1", email, name: "Test" };
  });
  const mockNavigate = vi.fn();
  return { state, doLoginMock, mockNavigate };
});

// Mock de AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    doLogin: doLoginMock,
    user: state.user, // se actualizará cuando doLoginMock lo cambie
  }),
}));

// Mock de react-router-dom solo para useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Importa el componente DESPUÉS de definir los mocks
import LoginForm from "../components/LoginForm";

beforeEach(() => {
  // Limpia estado entre pruebas
  state.user = null;
  doLoginMock.mockClear();
  mockNavigate.mockClear();
});

test("hace login y navega a /nueva", async () => {
  const { rerender } = render(<LoginForm />);

  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Correo/i), "a@a.com");
  await user.type(screen.getByLabelText(/Contraseña/i), "Secret123!");
  await user.click(screen.getByRole("button", { name: /Entrar/i }));

  // Se llamó doLogin con credenciales correctas
  await waitFor(() =>
    expect(doLoginMock).toHaveBeenCalledWith("a@a.com", "Secret123!")
  );

  // Forzamos re-render para que el hook lea el nuevo "user" del mock y dispare el useEffect
  rerender(<LoginForm />);

  // Verifica que se llamó navigate hacia /nueva
  await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  const calls = mockNavigate.mock.calls;
  const fueANueva = calls.some((args) => args[0] === "/nueva");
  expect(fueANueva).toBe(true);
});
