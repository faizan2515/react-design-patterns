import { lazy } from "react";
import type { ComponentType } from "react";
import { CATEGORIES } from "./categories";
import type { Pattern, PatternMeta, SourceFile } from "./types";

/*
  Auto-discovery. Adding a pattern means adding a folder under `src/patterns/<slug>/`
  containing a `meta.ts` and a `Demo.tsx` — there is no central list to remember to update.

  The `?raw` glob is what powers the source viewer: the code shown on a pattern page is
  literally the same file that renders the demo above it, so the two can never drift.
*/
const metaModules = import.meta.glob<{ default: PatternMeta }>(
  "../patterns/*/meta.ts",
  { eager: true },
);

const demoModules = import.meta.glob<{ default: ComponentType }>(
  "../patterns/*/Demo.tsx",
);

/*
  Sources load on demand, never eagerly. Highlighted markup is many times larger than the
  code it represents, so inlining every pattern's would put the whole catalog in the entry
  bundle for the sake of one page. These globs split per file instead.
*/
/*
  The patterns must be inline literals — `import.meta.glob` is compiled away by Vite and
  cannot read a shared variable. The `!` entry keeps meta.ts out, so the build stops
  emitting source chunks for it that nothing ever fetches.
*/
const rawLoaders = import.meta.glob<string>(
  [
    "../patterns/*/*.{ts,tsx}",
    "!../patterns/*/meta.ts",
    "!../patterns/*/*.snippet.ts",
  ],
  { query: "?raw", import: "default" },
);

/* Pre-rendered by vite/highlight.ts, so no highlighter ships to the browser. */
const highlightLoaders = import.meta.glob<string>(
  [
    "../patterns/*/*.{ts,tsx}",
    "!../patterns/*/meta.ts",
    "!../patterns/*/*.snippet.ts",
  ],
  { query: "?highlight", import: "default" },
);

/** "../patterns/compound-components/Tabs.tsx" -> "compound-components" */
function folderOf(path: string): string {
  return path.split("/")[2];
}

/** "../patterns/compound-components/Tabs.tsx" -> "Tabs.tsx" */
function fileOf(path: string): string {
  return path.split("/").slice(3).join("/");
}

function sourcePaths(slug: string): string[] {
  const paths = Object.keys(rawLoaders).filter(
    (path) => folderOf(path) === slug,
  );

  // A silently empty glob renders an empty source panel rather than failing, which is
  // hard to notice and easy to ship. Make it loud instead.
  if (paths.length === 0) {
    throw new Error(
      `No source files found for pattern "${slug}". Check the globs in registry/patterns.ts.`,
    );
  }

  return paths.sort((a, b) => {
    // Demo.tsx is the entry point, so it always reads first.
    if (fileOf(a) === "Demo.tsx") return -1;
    if (fileOf(b) === "Demo.tsx") return 1;
    return fileOf(a).localeCompare(fileOf(b));
  });
}

const sourceCache = new Map<string, Promise<SourceFile[]>>();

/**
 * Returns a stable promise per pattern so it can be read with `use()` under Suspense —
 * a fresh promise on every render would suspend forever.
 */
export function patternSources(slug: string): Promise<SourceFile[]> {
  const cached = sourceCache.get(slug);
  if (cached) return cached;

  const pending = Promise.all(
    sourcePaths(slug).map(async (path) => ({
      name: fileOf(path),
      code: await rawLoaders[path](),
      html: await highlightLoaders[path](),
    })),
  );

  sourceCache.set(slug, pending);
  return pending;
}

const CATEGORY_ORDER = new Map(CATEGORIES.map((c, i) => [c.id, i]));

function build(): Pattern[] {
  const patterns = Object.entries(metaModules).map(([path, module]) => {
    const slug = folderOf(path);
    const loadDemo = demoModules[`../patterns/${slug}/Demo.tsx`];

    if (!loadDemo) {
      throw new Error(
        `Pattern "${slug}" has a meta.ts but no Demo.tsx. Every pattern folder needs both.`,
      );
    }

    return {
      slug,
      meta: module.default,
      Demo: lazy(loadDemo),
    };
  });

  return patterns.sort((a, b) => {
    const byCategory =
      (CATEGORY_ORDER.get(a.meta.category) ?? 99) -
      (CATEGORY_ORDER.get(b.meta.category) ?? 99);
    if (byCategory !== 0) return byCategory;
    if (a.meta.tier !== b.meta.tier) return a.meta.tier - b.meta.tier;
    return a.meta.title.localeCompare(b.meta.title);
  });
}

export const PATTERNS = build();

export const PATTERN_BY_SLUG = new Map(PATTERNS.map((p) => [p.slug, p]));

export function patternsInCategory(id: string): Pattern[] {
  return PATTERNS.filter((p) => p.meta.category === id);
}

/** Resolves the `related` slugs on a pattern into real patterns, skipping any not yet built. */
export function relatedPatterns(pattern: Pattern): Pattern[] {
  return (pattern.meta.related ?? [])
    .map((slug) => PATTERN_BY_SLUG.get(slug))
    .filter((p) => p !== undefined);
}
