import { useCallback, useEffect, useRef, useState } from "react";

export interface Stopwatch {
  elapsed: number;
  running: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * A custom hook is just a function that calls other hooks. There is no registry, no
 * wrapper, no React API for declaring one — the `use` prefix is a naming convention that
 * lets the linter apply the rules of hooks, and that is the entire mechanism.
 *
 * What it buys you is a seam. The state, the interval, and the cleanup that stops it move
 * out of the component and behind a small API. A component using this hook cannot forget
 * to clear the interval, because it was never told there was one.
 */
export function useStopwatch(): Stopwatch {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  /*
    Time already banked from previous runs, and when the current run began. Keeping both
    in refs means the effect reads no reactive values, so `running` is its only dependency
    — if `elapsed` were a dependency the interval would be torn down and rebuilt on every
    tick, which is the classic way this hook goes wrong.
  */
  const banked = useRef(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!running) return;

    startedAt.current = performance.now();

    const id = setInterval(() => {
      setElapsed(banked.current + (performance.now() - startedAt.current));
    }, 50);

    // Cleanup lives next to the thing it undoes — easy to get right once extracted,
    // easy to forget when inlined into a component.
    return () => {
      banked.current += performance.now() - startedAt.current;
      clearInterval(id);
    };
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    banked.current = 0;
    startedAt.current = 0;
    setRunning(false);
    setElapsed(0);
  }, []);

  return { elapsed, running, start, stop, reset };
}
