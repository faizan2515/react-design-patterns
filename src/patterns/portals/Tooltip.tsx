import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * The same tooltip, rendered two ways, deliberately landing in the same place on screen.
 *
 * Inline it is positioned against its anchor with `absolute` and clipped by whichever
 * ancestor has `overflow: hidden`. Portaled it is positioned against the viewport with
 * `fixed`, at coordinates measured from that same anchor — so nothing about where it
 * *appears* changes, only whether an ancestor can cut it off.
 *
 * Measuring is the part a portal makes you do yourself. Leaving the DOM tree means leaving
 * behind the containing block that used to position you, which is why real tooltip
 * libraries ship a positioning engine rather than a call to `createPortal`.
 */
export function Tooltip({
  portaled,
  label,
  children,
}: {
  portaled: boolean;
  label: ReactNode;
  children: ReactNode;
}) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!portaled) return;

    function measure() {
      const box = anchor.current?.getBoundingClientRect();
      if (box) setPosition({ left: box.left, top: box.bottom + 6 });
    }

    measure();
    // `true` catches scrolling in any ancestor, not just the window.
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [portaled]);

  const bubble = (
    <span className="block whitespace-nowrap rounded border border-accent-line bg-surface px-2 py-1 font-mono text-[11px] text-fg shadow-lg">
      {label}
    </span>
  );

  return (
    <span ref={anchor} className="relative inline-block">
      {children}

      {portaled
        ? position &&
          createPortal(
            <span
              style={{ position: "fixed", left: position.left, top: position.top }}
              className="z-50"
            >
              {bubble}
            </span>,
            document.body,
          )
        : <span className="absolute left-0 top-full z-10 pt-1.5">{bubble}</span>}
    </span>
  );
}
