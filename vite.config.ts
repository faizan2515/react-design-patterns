import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { highlight } from "./vite/highlight.ts";
import { githubPages } from "./vite/pages.ts";

// https://vite.dev/config/
export default defineConfig({
  // The custom domain serves both assets and routes from the root.
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
    highlight(),
    githubPages(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
