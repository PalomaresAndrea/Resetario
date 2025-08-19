import React from "react";

export default function OTPInput({
  length = 6,
  value = "",
  onChange,
  autoFocus = false,
  name = "otp",
}) 

{
  const handleChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange?.(v);
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, length);
    if (text) {
      e.preventDefault();
      onChange?.(text);
    }
  };

  return (
    <input
      name={name}
      type="text"                 /* no "number" para no perder ceros a la izquierda */
      inputMode="numeric"         /* teclado numérico en móviles */
      pattern="\d*"               /* ayuda a validar solo dígitos en móviles */
      autoComplete="one-time-code"
      maxLength={length}
      autoFocus={autoFocus}
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      aria-label={`Código OTP de ${length} dígitos`}
      className="w-full max-w-xs px-4 py-3 text-center text-lg rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-300
                 tracking-widest [letter-spacing:.35em] [font-variant-numeric:tabular-nums]"
      placeholder={"•".repeat(length)}
    />
  );
}
