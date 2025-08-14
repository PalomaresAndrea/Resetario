import { render, screen, fireEvent } from "@testing-library/react";
import OTPInput from "../components/OTPInput";

test("solo acepta dígitos y recorta a length", () => {
  const onChange = vi.fn();
  render(<OTPInput length={6} value="" onChange={onChange} />);
  const input = screen.getByLabelText(/Código OTP/i);

  fireEvent.change(input, { target: { value: "12ab3456" } });
  expect(onChange).toHaveBeenLastCalledWith("123456");
});

test("pegar limpia no dígitos", () => {
  const onChange = vi.fn();
  render(<OTPInput length={4} value="" onChange={onChange} />);
  const input = screen.getByLabelText(/Código OTP/);

  const data = { getData: () => "a1b2c3d4" };
  fireEvent.paste(input, { clipboardData: data });
  expect(onChange).toHaveBeenLastCalledWith("1234");
});
