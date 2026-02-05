import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://localhost:4040",
        changeOrigin: true,
        secure: false,
      },
      "/ws": {
        target: "wss://localhost:4040",
        ws: true,
        secure: false,
        changeOrigin: true,
      }
    }
  }
});
