import { useEffect, useRef, useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { usePagedPeople } from "./usePagedPeople";

export default function Demo() {
  const [latency, setLatency] = useState(500);
  const [auto, setAuto] = useState(false);
  const { items, total, loading, hasMore, loadMore, reset } =
    usePagedPeople(latency);

  const sentinel = useRef<HTMLDivElement>(null);

  /*
    Infinite scroll via IntersectionObserver rather than a scroll listener.

    A scroll handler fires continuously and forces you to measure positions by hand; an
    observer fires once when the sentinel enters the viewport and costs nothing in
    between. The `hasMore` check matters — an observer left watching a sentinel that never
    leaves the screen will happily ask for page 900.
  */
  useEffect(() => {
    if (!auto || !hasMore) return;

    const node = sentinel.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void loadMore();
      },
      { rootMargin: "80px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [auto, hasMore, loadMore]);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="infinite scroll" checked={auto} onChange={setAuto} />
        <Knobs.Range
          label="Network"
          value={latency}
          onChange={setLatency}
          min={100}
          max={1500}
          step={100}
          unit="ms"
        />
        <Knobs.Action label="Reset" onClick={reset} />
        <Knobs.Readout label="loaded">
          {items.length}
          {total > 0 ? ` / ${total}` : ""}
        </Knobs.Readout>
      </Knobs>

      <div className="h-64 overflow-y-auto rounded-md border border-line">
        <ul className="divide-y divide-line">
          {items.map((person) => (
            <li key={person.id} className="flex gap-3 px-3 py-2">
              <span className="w-8 font-mono text-[10px] text-muted">
                {person.id}
              </span>
              <span className="text-[13px] text-fg">{person.name}</span>
            </li>
          ))}
        </ul>

        <div ref={sentinel} className="px-3 py-3 text-center">
          {loading && (
            <span className="font-mono text-[11px] text-muted">loading…</span>
          )}
          {!loading && hasMore && !auto && (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="rounded border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
            >
              Load more
            </button>
          )}
          {!hasMore && (
            <span className="font-mono text-[11px] text-muted">
              end of list
            </span>
          )}
        </div>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Turn on infinite scroll and scroll the list. An IntersectionObserver watches the
        sentinel at the bottom and asks for the next page when it comes into view — no
        scroll handler, no position maths, and nothing running while you are not near the
        end.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Two guards are doing quiet work. A ref blocks a second request while one is in
        flight, which is why a fast scroll does not fire three requests for the same page.
        And the observer disconnects once there is nothing left, or it would keep asking
        for pages past the end.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The pages are addressed by cursor, not by number. Offset paging shifts every later
        page whenever something is inserted or deleted mid-read, so items get skipped or
        repeated — a bug that only ever appears on live data.
      </p>
    </div>
  );
}
