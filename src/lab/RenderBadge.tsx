import { useRenderCount } from "./useRenderCount";

interface RenderBadgeProps {
  label?: string;
  count: number;
  /** Marks a badge whose number is the point of the demo. */
  highlight?: boolean;
}

/**
 * Displays a render count and flashes when it changes.
 *
 * The flash is driven by `key={count}`: a new key remounts the span, which restarts the
 * CSS animation. No timers, no state, no cleanup — and it is pattern #13 (key as reset)
 * doing something genuinely useful.
 */
export function RenderBadge({ label, count, highlight }: RenderBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] ${
        highlight
          ? "border-accent-line text-fg"
          : "border-line text-muted"
      }`}
    >
      {label && <span>{label}</span>}
      <span
        key={count}
        className="rdp-flash rounded px-1 tabular-nums text-fg"
        aria-label={`${count} renders`}
      >
        ×{count}
      </span>
    </span>
  );
}

/**
 * A badge that counts its own renders. Drop it into a subtree to answer "did this part
 * re-render?" — as opposed to `useRenderCount()`, which answers "how often did *this
 * component* render?".
 */
export function RenderProbe({
  label,
  highlight,
}: {
  label?: string;
  highlight?: boolean;
}) {
  const count = useRenderCount();
  return <RenderBadge label={label} count={count} highlight={highlight} />;
}
