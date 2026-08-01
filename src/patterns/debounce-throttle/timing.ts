import { useEffect, useRef, useState } from "react";

/**
 * Debounce: wait for a pause, then act once.
 *
 * Implemented as an effect over the value rather than a wrapped callback, because the
 * cleanup then cancels the pending timer automatically on every change and on unmount —
 * the leak that hand-rolled debounces usually have.
 */
export function useDebounced<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
}

/**
 * Throttle: act at most once per interval, while it keeps happening.
 *
 * The difference that matters: debounce may never fire while input continues, throttle
 * fires steadily throughout. Choose by asking whether you want the final value (debounce)
 * or a regular sample of an ongoing stream (throttle).
 */
export function useThrottled<T>(value: T, interval: number): T {
  const [sampled, setSampled] = useState(value);
  const lastRun = useRef(0);

  useEffect(() => {
    const elapsed = Date.now() - lastRun.current;

    if (elapsed >= interval) {
      lastRun.current = Date.now();
      setSampled(value);
      return;
    }

    // Trailing edge, so the final value is never dropped.
    const timer = setTimeout(() => {
      lastRun.current = Date.now();
      setSampled(value);
    }, interval - elapsed);

    return () => clearTimeout(timer);
  }, [value, interval]);

  return sampled;
}
