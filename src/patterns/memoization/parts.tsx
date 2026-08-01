import { memo } from "react";
import { burn } from "../../lab/burn";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import type { ReactNode } from "react";

export interface ChildProps {
  cost: number;
  onPing: () => void;
}

/**
 * The child every variant renders. Opted out of the compiler so its own body is never
 * memoised — whether it re-renders is decided entirely by its parent.
 */
export function Child({ cost, onPing }: ChildProps) {
  "use no memo";

  const renders = useRenderCount();
  burn(cost);

  return (
    <div className="flex items-center justify-between gap-2 rounded border border-line px-2.5 py-2">
      <button
        type="button"
        onClick={onPing}
        className="font-mono text-[10px] text-muted"
      >
        child
      </button>
      <RenderBadge count={renders} highlight />
    </div>
  );
}

/**
 * `memo` compares props and skips the render when they are shallow-equal — which only
 * helps if the props are actually stable. Hand it a fresh arrow function each render and
 * it compares, finds a difference, and re-renders anyway, having added a comparison for
 * nothing.
 */
export const MemoChild = memo(Child);

export function Card({
  title,
  note,
  parentRenders,
  bumps,
  onBump,
  children,
}: {
  title: string;
  note: string;
  parentRenders: number;
  bumps: number;
  onBump: () => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-md border border-line p-3">
      <p className="font-mono text-[11px] text-fg">{title}</p>
      <p className="font-mono text-[10px] leading-relaxed text-muted">{note}</p>

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onBump}
          className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted transition-colors hover:border-accent-line hover:text-fg"
        >
          re-render parent
        </button>
        <RenderBadge label="parent" count={parentRenders} />
      </div>

      <p className="font-mono text-[10px] text-muted">bumps: {bumps}</p>

      {children}
    </div>
  );
}
