import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      // Todas las llamadas a /api en el front se envían al backend en 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    // Evita fallas de HMR/WebSocket en entornos Windows/AV/VPN
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  }
})
