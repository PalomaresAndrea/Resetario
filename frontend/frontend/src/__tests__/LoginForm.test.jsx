import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../components/LoginForm";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ doLogin: vi.fn().mockResolvedValue({}) }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

test("hace login y navega a /nueva", async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/Correo/i), "a@a.com");
  await userEvent.type(screen.getByLabelText(/Contraseña/i), "Secret123!");
  await userEvent.click(screen.getByRole("button", { name: /Entrar/i }));

  expect(mockNavigate).toHaveBeenCalledWith("/nueva");
});
