import { useState } from "react";
import type { ReactNode } from "react";

export interface Point {
  x: number;
  y: number;
  inside: boolean;
}

/**
 * A render prop: the component owns behaviour and hands the result to a function, letting
 * the caller decide what to draw with it.
 *
 * Passing that function as `children` is the "function as a child" variant — the same
 * pattern, just using the children slot instead of a named prop.
 *
 * A hook could supply these coordinates with less ceremony. What a hook cannot do is what
 * this component also does: own the element the behaviour is attached to. That is the
 * niche render props still occupy — virtualised lists handing you a window of items,
 * drag layers handing you a drag state, anything where the provider must render something
 * of its own around the caller's output.
 */
export function Tracker({
  children,
}: {
  children: (point: Point) => ReactNode;
}) {
  const [point, setPoint] = useState<Point>({ x: 0, y: 0, inside: false });

  return (
    <div
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        setPoint({
          x: Math.round(event.clientX - box.left),
          y: Math.round(event.clientY - box.top),
          inside: true,
        });
      }}
      onPointerLeave={() => setPoint((p) => ({ ...p, inside: false }))}
      className="relative h-40 overflow-hidden rounded border border-line bg-surface-2"
    >
      {children(point)}
    </div>
  );
}
