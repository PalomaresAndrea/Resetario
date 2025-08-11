import { useRef } from "react";

export default function OTPInput({ length=6, value="", onChange }) {
  const refs = useRef([]);

  const toArray = (v) => (v + "").padEnd(length, " ").slice(0, length).split("");
  const arr = toArray(value);

  const setChar = (idx, ch) => {
    const v = (value + "").split("");
    v[idx] = ch;
    onChange(v.join("").replace(/\s/g, ""));
  };

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    setChar(i, ch);
    if (ch && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !arr[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text);
    e.preventDefault();
    refs.current[Math.min(text.length, length) - 1]?.focus();
  };

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={arr[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-12 text-center text-lg rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-300"
        />
      ))}
    </div>
  );
}
