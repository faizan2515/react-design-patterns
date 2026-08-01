import { useCallback, useMemo, useReducer, useRef } from "react";

export interface LogEntry {
  id: number;
  /** Milliseconds since the log was created. */
  at: number;
  message: string;
  tone?: "default" | "accent" | "warn";
}

type Action = { type: "add"; entry: LogEntry } | { type: "clear" };

function reducer(entries: LogEntry[], action: Action): LogEntry[] {
  if (action.type === "clear") return [];
  return [...entries, action.entry];
}

/** Stable for the lifetime of the component — safe to put in a dependency array. */
export interface EventLogControl {
  add: (message: string, tone?: LogEntry["tone"]) => void;
  clear: () => void;
}

/**
 * An append-only timeline for making invisible things visible — effect order, cleanup,
 * fetch lifecycles, subscription teardown.
 *
 * Returns entries and controls *separately*, on purpose. Entries change on every append;
 * controls never do. Bundling them into one object would mean the log's identity changed
 * every time something was logged, so any effect that both depends on the log and writes
 * to it would re-run forever. Splitting them makes the safe usage the obvious one.
 */
export function useEventLog(limit = 60): [LogEntry[], EventLogControl] {
  const [entries, dispatch] = useReducer(reducer, []);
  const start = useRef(performance.now());
  const nextId = useRef(0);

  const add = useCallback(
    (message: string, tone: LogEntry["tone"] = "default") => {
      dispatch({
        type: "add",
        entry: {
          id: nextId.current++,
          at: Math.round(performance.now() - start.current),
          message,
          tone,
        },
      });
    },
    [],
  );

  const clear = useCallback(() => {
    start.current = performance.now();
    dispatch({ type: "clear" });
  }, []);

  const control = useMemo<EventLogControl>(() => ({ add, clear }), [add, clear]);
  const visible = entries.length > limit ? entries.slice(-limit) : entries;

  return [visible, control];
}
