import { burn } from "./burn";
import { useRenderCount } from "./useRenderCount";
import { RenderBadge } from "./RenderBadge";

/**
 * A component that is expensive on purpose, for demonstrating memoisation.
 *
 * Opted out of React Compiler: the compiler would happily memoise the cost away, which
 * is the correct thing for real code and the wrong thing for a demo whose entire job is
 * to show what that cost feels like before it is optimised.
 */
export function Slow({
  ms = 16,
  label = "Slow",
  highlight,
}: {
  ms?: number;
  label?: string;
  highlight?: boolean;
}) {
  "use no memo";

  const renders = useRenderCount();
  burn(ms);

  return (
    <span className="inline-flex items-center gap-2">
      <RenderBadge label={`${label} · ${ms}ms`} count={renders} highlight={highlight} />
    </span>
  );
}
