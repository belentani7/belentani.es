import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// build directo al sitio servido: /viaje3d/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "../app-web-nextjs/belentani7.github.io/viaje3d", emptyOutDir: true, chunkSizeWarningLimit: 2000 }
});
