import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// Configuración específica para construir sólo el core (vanilla)
// Genera un bundle ESM en dist-core/core.js sin dependencias de React
// para no sobrescribir el bundle principal de React.
export default defineConfig({
  plugins: [
    dts({
      include: ["src/core"],
      outDir: "dist/core-types",
    }),
  ],
  build: {
    outDir: "dist-core",
    lib: {
      entry: resolve(__dirname, "src/core/Shortcut.ts"),
      name: "ShortcutCore",
      fileName: () => "core.js",
      formats: ["es"],
    },
    rollupOptions: {
      // Core puro: no depende de React
      external: [],
      output: {
        exports: "named",
      },
    },
  },
});

