import { useEffect, useRef, useState } from "react";

export interface VirtualWindow {
  start: number;
  end: number;
  offset: number;
  totalHeight: number;
}

/**
 * Windowing: render only the rows currently in view, plus a small overscan.
 *
 * The maths is deliberately simple because fixed-height rows make it simple — position is
 * `index * rowHeight`, so the visible range is arithmetic rather than measurement.
 * Variable heights are where this gets genuinely hard, and where a library earns its
 * weight: it has to measure rows as they render and correct the scroll position without
 * the content jumping.
 *
 * `overscan` renders a few extra rows above and below so a fast scroll does not reach
 * empty space before React catches up.
 */
export function useVirtual(
  count: number,
  rowHeight: number,
  overscan = 4,
): [React.RefObject<HTMLDivElement | null>, VirtualWindow] {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    setViewport(node.clientHeight);

    const onScroll = () => setScrollTop(node.scrollTop);
    node.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(() => setViewport(node.clientHeight));
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const first = Math.floor(scrollTop / rowHeight);
  const visible = Math.ceil(viewport / rowHeight);

  const start = Math.max(0, first - overscan);
  const end = Math.min(count, first + visible + overscan);

  return [
    ref,
    {
      start,
      end,
      // Push the rendered slice down so it sits where those rows actually belong.
      offset: start * rowHeight,
      totalHeight: count * rowHeight,
    },
  ];
}
