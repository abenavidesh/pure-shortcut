import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "shortcut",
      fileName: (format) =>
        format === "es"
          ? "index.js"
          : format === "cjs"
          ? "index.cjs"
          : "index.umd.cjs",
    },
    rollupOptions: {
      // React bundle (for React usage) sigue marcando react como external
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  // Configuración adicional para un bundle sólo-core (vanilla)
  // Se generará como "dist/core.js" (ESM) sin dependencias de React.
  // Nota: Vite no soporta múltiples build.lib directamente, pero podemos
  // usar manualmente un entry alterno si fuese necesario mediante
  // un comando de build adicional en package.json (p.ej. "build:core").
});
