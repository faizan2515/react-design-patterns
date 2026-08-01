import { useEffect, useRef, useState } from "react";

export interface PollingOptions {
  interval: number;
  enabled: boolean;
  /** Stop polling while the tab is hidden, and catch up when it returns. */
  pauseWhenHidden: boolean;
  onEvent?: (message: string, tone?: "default" | "accent" | "warn") => void;
}

/**
 * Polling that behaves itself.
 *
 * The naive version is `setInterval(fetch, 5000)`, and it is wrong in three ways that only
 * show up in production:
 *
 *   1. It keeps requesting in background tabs, so a user with the app open all day sends
 *      thousands of pointless requests — multiplied by every user.
 *   2. On failure it keeps hammering at the same rate, so a struggling server gets its
 *      load *increased* by every client at once.
 *   3. It can overlap: if a response takes longer than the interval, requests pile up.
 *
 * Scheduling the next run only after the previous one finishes fixes the overlap, backing
 * off on failure fixes the stampede, and pausing on hidden fixes the waste.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  { interval, enabled, pauseWhenHidden, onEvent }: PollingOptions,
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [failures, setFailures] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const eventRef = useRef(onEvent);
  eventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let consecutiveFailures = 0;

    async function run() {
      if (cancelled) return;

      if (pauseWhenHidden && document.visibilityState === "hidden") {
        eventRef.current?.("tab hidden — skipping this tick");
        schedule(interval);
        return;
      }

      try {
        const next = await fetcherRef.current();
        if (cancelled) return;

        consecutiveFailures = 0;
        setFailures(0);
        setData(next);
        eventRef.current?.("ok", "accent");
        schedule(interval);
      } catch {
        if (cancelled) return;

        consecutiveFailures += 1;
        setFailures(consecutiveFailures);

        // Exponential backoff, capped — so a struggling server is not hammered harder
        // by every client the moment it starts failing.
        const delay = Math.min(interval * 2 ** consecutiveFailures, 30_000);
        eventRef.current?.(`failed — retrying in ${Math.round(delay)}ms`, "warn");
        schedule(delay);
      }
    }

    function schedule(delay: number) {
      // Scheduled after completion, never on a fixed interval, so slow responses
      // cannot overlap.
      timer = setTimeout(run, delay);
    }

    void run();

    function onVisible() {
      if (document.visibilityState === "visible" && pauseWhenHidden) {
        eventRef.current?.("tab visible — polling immediately");
        clearTimeout(timer);
        void run();
      }
    }

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [interval, enabled, pauseWhenHidden]);

  return { data, failures };
}
