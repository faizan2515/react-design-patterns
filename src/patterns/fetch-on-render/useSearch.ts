import { useEffect, useState } from "react";
import { PEOPLE } from "../../lab/data";
import type { Person } from "../../lab/data";
import { fakeRequest } from "../../lab/fakeApi";
import type { EventLogControl } from "../../lab/useEventLog";

export type Status = "idle" | "loading" | "ready";

export interface SearchState {
  status: Status;
  results: Person[];
  /** Which query the displayed results actually belong to. */
  appliedFor: string;
}

/**
 * Broader queries match more rows and take longer, which is what makes this race real:
 * responses come back in a different order than the requests went out.
 */
function latencyFor(query: string, base: number): number {
  const breadth = Math.max(0, 5 - query.trim().length);
  return Math.round(base * (1 + breadth * 0.45));
}

function search(query: string, ms: number, signal: AbortSignal) {
  return fakeRequest(
    () =>
      PEOPLE.filter((person) =>
        person.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    { latency: ms, signal },
  );
}

/**
 * Fetch-on-render — an effect that fetches when its inputs change.
 *
 * The pattern is not the fetch, it is the bookkeeping around it. Two lines decide whether
 * this code is correct: marking the effect run as superseded on cleanup, and refusing to
 * apply a response that is no longer the one being awaited.
 *
 * Turn the guard off and type quickly. A slow request for "a" lands after a fast request
 * for "ada" and overwrites fresher results with staler ones — the input says one thing
 * and the list shows another. It only reproduces on slow connections, which is to say it
 * reaches users and not developers.
 */
export function useSearch(
  query: string,
  { latency, guard, log }: { latency: number; guard: boolean; log: EventLogControl },
): SearchState {
  const [state, setState] = useState<SearchState>({
    status: "idle",
    results: [],
    appliedFor: "",
  });

  useEffect(() => {
    if (query.trim() === "") {
      setState({ status: "idle", results: [], appliedFor: "" });
      return;
    }

    const controller = new AbortController();
    let current = true;

    const ms = latencyFor(query, latency);
    setState((previous) => ({ ...previous, status: "loading" }));
    log.add(`send    "${query}"  (${ms}ms)`, "accent");

    search(query, ms, controller.signal)
      .then((results) => {
        if (guard && !current) {
          log.add(`drop    "${query}"  superseded`);
          return;
        }

        log.add(`apply   "${query}"  ${results.length} results`, "warn");
        setState({ status: "ready", results, appliedFor: query });
      })
      .catch((error: unknown) => {
        // An aborted request is an expected outcome here, not a failure.
        if (error instanceof DOMException && error.name === "AbortError") return;
        throw error;
      });

    return () => {
      current = false;
      if (guard) controller.abort(new DOMException("Superseded", "AbortError"));
    };
  }, [query, latency, guard, log]);

  return state;
}
