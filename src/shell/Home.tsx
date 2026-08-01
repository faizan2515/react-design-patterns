import { Link } from "react-router";
import { CATEGORIES } from "../registry/categories";
import { PATTERNS, patternsInCategory } from "../registry/patterns";
import { TierMeter } from "./TierMeter";

export function Home() {
  return (
    <div className="mx-auto max-w-225 px-6 py-14 sm:px-10 sm:py-20">
      <header className="border-b border-line pb-12">
        {/* Counted from the registry, so it cannot drift the way a hardcoded total did. */}
        <p className="u-label text-[10px] text-muted">
          {PATTERNS.length} patterns · {CATEGORIES.length} categories
        </p>

        <h1 className="u-display mt-6 text-[34px] leading-[1.12] text-fg sm:text-[46px]">
          Patterns you can
          <br />
          take <span className="text-accent">apart</span>.
        </h1>

        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
          Every pattern here is a component that actually runs, with the source
          that renders it sitting directly underneath. Click things, break them,
          then read why they are built that way.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {CATEGORIES.map((category) => {
          const patterns = patternsInCategory(category.id);

          return (
            <section key={category.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="u-label text-[12px] text-fg">{category.label}</h2>
                <span className="font-mono text-[11px] text-muted">
                  {patterns.length || "—"}
                </span>
              </div>

              <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-muted">
                {category.blurb}
              </p>

              {patterns.length > 0 ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {patterns.map((pattern) => (
                    <li key={pattern.slug}>
                      <Link
                        to={`/${pattern.meta.category}/${pattern.slug}`}
                        className="block h-full rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent-line"
                      >
                        <span className="flex items-center gap-2">
                          <TierMeter tier={pattern.meta.tier} />
                          <span className="font-mono text-[13px] text-fg">
                            {pattern.meta.title}
                          </span>
                        </span>
                        <span className="mt-2 block text-[13px] leading-relaxed text-muted">
                          {pattern.meta.blurb}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-lg border border-dashed border-line px-4 py-3 font-mono text-[12px] text-muted">
                  Not built yet
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
