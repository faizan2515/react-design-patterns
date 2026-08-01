import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { highlight } from "./vite/highlight.ts";
import { githubPages } from "./vite/pages.ts";

/**
 * The repository name, because GitHub Pages serves project sites from a subpath. Change
 * this and the router follows automatically — it reads `import.meta.env.BASE_URL`.
 */
const BASE = "/react-design-patterns/";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Only in the build: dev stays at the root so local URLs are not prefixed.
  base: command === "build" ? BASE : "/",

  plugins: [
    react(),
    tailwindcss(),
    highlight(),
    githubPages(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
}));
