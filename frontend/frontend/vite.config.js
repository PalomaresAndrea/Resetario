// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = (env.VITE_API_URL || "").trim();
  const useProxy = apiUrl === "";

  return {
    plugins: [react()],
    server: {
      host: true,           // permite acceder desde red o contenedores
      port: 5173,
      proxy: useProxy
        ? {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
      hmr: { protocol: "ws", host: "localhost", port: 5173 },
    },
    preview: { host: true, port: 5173 },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
      css: true,
    },
    build: {
      outDir: "dist",
      sourcemap: true, // útil para diagnosticar en Azure
    },
  };
});
