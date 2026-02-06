import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4040",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      "/ws": {
        target: "http://localhost:4040",
        ws: true,
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path
      },
      "/uploads": {
        target: "http://localhost:4040",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
