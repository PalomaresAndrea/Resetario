import "@testing-library/jest-dom";
import { vi } from "vitest";

// Stubs útiles para jsdom
if (!Element.prototype.scrollBy) Element.prototype.scrollBy = () => {};
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
if (!window.scrollTo) window.scrollTo = () => {};

if (!window.matchMedia) {
  // Evita warnings si algún componente usa matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),        // deprecated
      removeListener: vi.fn(),     // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// Evitar errores por alert en componentes
Object.defineProperty(window, "alert", { value: vi.fn(), writable: true });
