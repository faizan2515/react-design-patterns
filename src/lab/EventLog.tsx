import { useEffect, useRef } from "react";
import type { LogEntry } from "./useEventLog";

const TONE_CLASS = {
  default: "text-muted",
  accent: "text-accent",
  warn: "text-fg",
} as const;

/**
 * Renders an event log as a timeline. Entries append at the bottom and the viewport
 * follows them, so a running sequence reads top to bottom like a trace.
 */
export function EventLog({
  entries,
  onClear,
  title = "Trace",
  empty = "Nothing logged yet.",
}: {
  entries: LogEntry[];
  onClear?: () => void;
  title?: string;
  empty?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries]);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface-2">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="u-label text-[9.5px] text-muted">{title}</span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="u-label rounded px-1.5 py-0.5 text-[9.5px] text-muted transition-colors hover:bg-accent-soft hover:text-fg"
          >
            Clear
          </button>
        )}
      </div>

      <div ref={scroller} className="max-h-44 overflow-y-auto px-3 py-2">
        {entries.length === 0 ? (
          <p className="py-1 font-mono text-[11px] text-muted">{empty}</p>
        ) : (
          <ol className="space-y-0.5">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex gap-3 font-mono text-[11px] leading-relaxed"
              >
                <span className="shrink-0 tabular-nums text-muted opacity-60">
                  {String(entry.at).padStart(4, " ")}ms
                </span>
                <span className={TONE_CLASS[entry.tone ?? "default"]}>
                  {entry.message}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
