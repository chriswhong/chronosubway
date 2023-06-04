import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdPlugin, { Mode } from "vite-plugin-markdown";

export default defineConfig({
  plugins: [
    react(),
    mdPlugin.default({
      mode: Mode.REACT,
    }),
  ],
});
