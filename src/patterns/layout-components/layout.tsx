import type { ReactNode } from "react";

type Gap = 0 | 1 | 2 | 3 | 4;

const GAP: Record<Gap, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-4",
  4: "gap-6",
};

/**
 * Spacing as a component rather than a margin.
 *
 * A child with `margin-bottom` carries an opinion about its neighbours everywhere it is
 * used — and the opinion is wrong the moment it is used somewhere else, or first, or
 * alone. Moving the spacing to the parent means a component only describes itself, and
 * whoever arranges it decides the rhythm.
 *
 * It also sidesteps margin collapsing and the "last child needs no margin" special case,
 * neither of which exists when the parent owns the gap.
 */
export function Stack({
  gap = 2,
  children,
}: {
  gap?: Gap;
  children: ReactNode;
}) {
  return <div className={`flex flex-col ${GAP[gap]}`}>{children}</div>;
}

export function Row({
  gap = 2,
  align = "center",
  wrap = true,
  children,
}: {
  gap?: Gap;
  align?: "start" | "center" | "end" | "baseline";
  wrap?: boolean;
  children: ReactNode;
}) {
  const alignment = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
  }[align];

  return (
    <div
      className={`flex ${wrap ? "flex-wrap" : ""} ${alignment} ${GAP[gap]}`}
    >
      {children}
    </div>
  );
}

export function Grid({
  min = 140,
  gap = 2,
  children,
}: {
  min?: number;
  gap?: Gap;
  children: ReactNode;
}) {
  /* Intrinsically responsive — it wraps on available width, with no breakpoints to keep in sync. */
  return (
    <div
      className={`grid ${GAP[gap]}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
