import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    react(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/index.ts"),
      name: "Widgets",
      formats: ["es", "umd"],
      fileName: (format) => `widget.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        // "styled-components"
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          // "styled-components": "styled",
        },
      },
    },
  },
});
