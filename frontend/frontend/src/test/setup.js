import "@testing-library/jest-dom";

// Stubs útiles para jsdom
if (!Element.prototype.scrollBy) Element.prototype.scrollBy = () => {};
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};

// Evitar errores por alert en componentes
globalThis.alert = globalThis.alert || (() => {});
