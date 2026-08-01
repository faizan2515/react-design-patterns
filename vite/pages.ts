import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Prepares the build output for GitHub Pages.
 *
 * `404.html` is a copy of `index.html`. Pages serves it for any path it has no file for,
 * without changing the URL — so a deep link like `/state/use-reducer` boots the app, React
 * Router reads the real location, and the right pattern renders. Without it every URL
 * except the root is a 404 on refresh or when shared.
 *
 * `.nojekyll` stops Jekyll processing the output. The artifact-based deploy does not run
 * Jekyll anyway, but it costs nothing and matters immediately if this ever moves to a
 * branch-based deploy, where Jekyll would silently drop any file starting with an
 * underscore.
 */
export function githubPages(): Plugin {
  let outDir = "dist";
  let root = process.cwd();

  return {
    name: "rdp:github-pages",
    apply: "build",

    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
    },

    async closeBundle() {
      const dir = path.resolve(root, outDir);

      await copyFile(path.join(dir, "index.html"), path.join(dir, "404.html"));
      await writeFile(path.join(dir, ".nojekyll"), "");
    },
  };
}
