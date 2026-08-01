import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";
import { createHighlighter } from "shiki";
import type { BundledLanguage, Highlighter } from "shiki";

const THEMES = { light: "vitesse-light", dark: "vitesse-dark" } as const;
const LANGS: BundledLanguage[] = ["tsx", "ts", "css"];

const LANG_BY_EXTENSION: Record<string, BundledLanguage> = {
  tsx: "tsx",
  ts: "ts",
  css: "css",
};

interface Request {
  file: string;
  lang: BundledLanguage;
}

/**
 * Recognises `?highlight`, optionally with `&lang=`.
 *
 * The language normally comes from the extension, but pages that present code as
 * *content* — the Server Components explainer, for instance — keep their snippets in
 * `.txt` so they are neither type-checked nor linted, since they reference modules that
 * do not exist here. Those pass the language explicitly.
 */
function parse(id: string): Request | null {
  const [file, query = ""] = id.split("?");
  const params = new URLSearchParams(query);

  if (!params.has("highlight")) return null;

  const requested = params.get("lang");
  const extension = file.split(".").pop() ?? "";

  return {
    file,
    lang:
      (requested as BundledLanguage | null) ??
      LANG_BY_EXTENSION[extension] ??
      "ts",
  };
}

/**
 * Highlights source at build time.
 *
 * `import html from "./Demo.tsx?highlight"` returns pre-rendered markup, so the browser
 * never downloads a highlighter or parses a grammar — the colouring costs zero runtime
 * JavaScript and Shiki stays a devDependency.
 *
 * Tokens carry both themes as CSS custom properties rather than baked-in colours, so the
 * existing `prefers-color-scheme` switch recolours code with no second render.
 */
export function highlight(): Plugin {
  let highlighter: Highlighter | undefined;

  return {
    name: "rdp:highlight",
    enforce: "pre",

    async resolveId(id, importer) {
      const request = parse(id);
      if (!request) return null;

      const resolved = await this.resolve(request.file, importer, {
        skipSelf: true,
      });
      if (!resolved) return null;

      // Re-attach the original query so `load` sees it too.
      const query = id.slice(id.indexOf("?"));
      return `${resolved.id}${query}`;
    },

    async load(id) {
      const request = parse(id);
      if (!request) return null;

      highlighter ??= await createHighlighter({
        themes: [THEMES.light, THEMES.dark],
        langs: LANGS,
      });

      const code = await readFile(request.file, "utf8");
      const html = highlighter.codeToHtml(code.trimEnd(), {
        lang: request.lang,
        themes: THEMES,
        // Emit both palettes as variables instead of committing to one at build time.
        defaultColor: false,
      });

      // Re-highlight when the source changes, so dev HMR stays honest.
      this.addWatchFile(request.file);

      return `export default ${JSON.stringify(html)};`;
    },
  };
}
