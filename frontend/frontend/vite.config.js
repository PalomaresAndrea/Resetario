// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const hasRemote = !!(env.VITE_API_URL && env.VITE_API_URL.trim());

  return {
    plugins: [react()],
    server: {
      host: "localhost",
      port: 5173,
      proxy: hasRemote
        ? undefined
        : {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          },
      hmr: { protocol: "ws", host: "localhost", port: 5173 },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
      css: true
    }
  };
});
