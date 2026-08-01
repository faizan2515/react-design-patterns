import { useCallback, useEffect, useRef, useState } from "react";
import { manyPeople } from "../../lab/data";
import type { Person } from "../../lab/data";
import { fakeRequest } from "../../lab/fakeApi";

const ALL = manyPeople(64);
const PAGE_SIZE = 8;

export interface Page {
  items: Person[];
  nextCursor: number | null;
  total: number;
}

/**
 * Cursor pagination rather than page numbers.
 *
 * `?page=3` is computed from an offset, so anything inserted or deleted while the user
 * reads shifts every later page — items get skipped or shown twice, and nobody notices
 * until a customer does. A cursor names a position in the data instead of counting from
 * the start, so it stays correct while the list underneath it changes.
 */
function loadPage(cursor: number, latency: number): Promise<Page> {
  return fakeRequest(
    () => {
      const items = ALL.slice(cursor, cursor + PAGE_SIZE);
      const next = cursor + PAGE_SIZE;
      return {
        items,
        nextCursor: next < ALL.length ? next : null,
        total: ALL.length,
      };
    },
    { latency },
  );
}

export function usePagedPeople(latency: number) {
  const [items, setItems] = useState<Person[]>([]);
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  /* Guards against a second load starting while one is in flight — the reason naive
     infinite scroll fires three requests for the same page on a fast scroll. */
  const busy = useRef(false);

  const loadMore = useCallback(async () => {
    if (busy.current || cursor === null) return;

    busy.current = true;
    setLoading(true);

    try {
      const page = await loadPage(cursor, latency);
      setItems((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
      setTotal(page.total);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, [cursor, latency]);

  const reset = useCallback(() => {
    setItems([]);
    setCursor(0);
    setTotal(0);
  }, []);

  useEffect(() => {
    if (items.length === 0 && cursor === 0) void loadMore();
  }, [items.length, cursor, loadMore]);

  return {
    items,
    total,
    loading,
    hasMore: cursor !== null,
    loadMore,
    reset,
  };
}
