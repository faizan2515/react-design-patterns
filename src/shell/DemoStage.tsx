import { Suspense, useState } from "react";
import type { ComponentType } from "react";

/**
 * The signature element: demos sit in a lit bay with an instrument rail above them.
 *
 * Reset works by bumping a `key`, which throws away the subtree and remounts it with
 * fresh state — the same trick pattern #13 teaches. The mount counter makes that
 * visible instead of leaving it as a claim.
 */
export function DemoStage({ Demo }: { Demo: ComponentType }) {
  const [mount, setMount] = useState(0);

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-stage">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="u-label flex items-center gap-1.5 text-[10px] text-muted">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Live
        </span>

        <div className="flex items-center gap-3 font-mono text-[10px] tracking-wide text-muted">
          {mount > 0 && <span>mount #{mount + 1}</span>}
          <button
            type="button"
            onClick={() => setMount((n) => n + 1)}
            className="u-label rounded px-1.5 py-0.5 text-[10px] transition-colors hover:bg-accent-soft hover:text-fg"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <Suspense
          fallback={
            <p className="font-mono text-[12px] text-muted">Loading demo…</p>
          }
        >
          <Demo key={mount} />
        </Suspense>
      </div>
    </section>
  );
}
