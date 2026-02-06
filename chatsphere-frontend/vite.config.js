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
<<<<<<< HEAD
=======
        rewrite: (path) => path
>>>>>>> 5fe7b79 (update)
      },
      "/ws": {
        target: "https://localhost:4040",
        ws: true,
        secure: false,
        changeOrigin: true,
<<<<<<< HEAD
=======
        rewrite: (path) => path
>>>>>>> 5fe7b79 (update)
      }
    }
  }
});
