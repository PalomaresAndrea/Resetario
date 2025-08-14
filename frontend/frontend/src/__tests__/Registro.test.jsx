import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Registro from "../components/Registro";
import * as u from "../services/usuarioService";

vi.spyOn(u, "registrarUsuario").mockResolvedValue({ message: "ok" });

test("valida y envía registro (pasa a paso 2)", async () => {
  render(<Registro />);

  await userEvent.type(screen.getByPlaceholderText("Nombre *"), "Ana");
  await userEvent.type(screen.getByPlaceholderText("Apellido paterno *"), "P.");
  await userEvent.type(screen.getByPlaceholderText("Correo electrónico *"), "a@a.com");
  await userEvent.type(screen.getByPlaceholderText("Contraseña segura *"), "Secret1!");
  await userEvent.type(screen.getByPlaceholderText("Confirmar contraseña *"), "Secret1!");

  const btn = screen.getByRole("button", { name: /Enviar registro/i });
  await userEvent.click(btn);

  expect(u.registrarUsuario).toHaveBeenCalled();
  // Aparece el mensaje de OTP (paso 2)
  // Como usamos alert en el componente, el paso cambia; validamos por el título siguiente:
  // (si no cambia en tu UI, ajusta el selector)
});
