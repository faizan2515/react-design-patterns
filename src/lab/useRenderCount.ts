import { useRef } from "react";

/**
 * Counts how many times the calling component has rendered.
 *
 * Call it *inside* the component you want to measure. Wrapping a component in a counter
 * would measure the wrapper instead — and with React Compiler auto-memoising, a child
 * whose props never change genuinely will not re-render when its parent does, so the
 * wrapper's number would be a truthful answer to the wrong question.
 *
 * Mutating a ref during render is impure, which is exactly why this is a lab instrument
 * and not something to copy into production code.
 */
export function useRenderCount(): number {
  "use no memo";

  const count = useRef(0);
  count.current += 1;
  return count.current;
}
