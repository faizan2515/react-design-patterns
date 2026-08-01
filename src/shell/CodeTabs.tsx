import { use, useEffect, useState } from "react";
import { patternSources } from "../registry/patterns";

/**
 * Source viewer. The code shown here comes straight from the pattern folder through a
 * `?raw` glob, so it is the same text that renders the demo above — the two cannot fall
 * out of sync. Colouring is baked in at build time by `vite/highlight.ts`.
 *
 * Sources arrive through `use()` rather than an effect, which is pattern #29 doing real
 * work in the shell that displays it.
 */
export function CodeTabs({ slug }: { slug: string }) {
  const files = use(patternSources(slug));
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = files[active];

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!current) return null;

  async function copy() {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-code">
      <div className="flex items-center justify-between gap-2 border-b border-line pl-1">
        <div role="tablist" className="flex min-w-0 overflow-x-auto">
          {files.map((file, index) => (
            <button
              key={file.name}
              role="tab"
              type="button"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`shrink-0 border-b-2 px-3 py-2 font-mono text-[12px] transition-colors ${
                index === active
                  ? "border-accent text-fg"
                  : "border-transparent text-muted hover:text-fg"
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={copy}
          className="u-label mr-2 shrink-0 rounded px-2 py-1 text-[10px] text-muted transition-colors hover:bg-accent-soft hover:text-fg"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/*
        This markup is generated at build time by our own Vite plugin from files in this
        repo — it never contains anything a visitor supplied, so injecting it is safe.
      */}
      <div
        className="rdp-code overflow-x-auto p-4 text-[12.5px] leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: current.html }}
      />
    </section>
  );
}
