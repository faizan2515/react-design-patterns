import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Tracker } from "./Tracker";

const RENDERERS = [
  { value: "readout", label: "Readout" },
  { value: "dot", label: "Follower" },
  { value: "colour", label: "Colour" },
] as const;

type Renderer = (typeof RENDERERS)[number]["value"];

export default function Demo() {
  const [renderer, setRenderer] = useState<Renderer>("readout");

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Render as"
          value={renderer}
          onChange={setRenderer}
          options={RENDERERS}
        />
      </Knobs>

      <Tracker>
        {({ x, y, inside }) => {
          if (!inside) {
            return (
              <p className="grid h-full place-items-center font-mono text-[11px] text-muted">
                Move the pointer in here
              </p>
            );
          }

          if (renderer === "readout") {
            return (
              <p className="grid h-full place-items-center font-mono text-[22px] tabular-nums text-fg">
                {x} · {y}
              </p>
            );
          }

          if (renderer === "dot") {
            return (
              <span
                style={{ left: x, top: y }}
                className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              />
            );
          }

          return (
            <div
              style={{ filter: `hue-rotate(${x * 2}deg)`, opacity: 0.25 + y / 200 }}
              className="h-full w-full bg-accent"
            />
          );
        }}
      </Tracker>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        One <code className="text-fg">Tracker</code>, three completely different outputs.
        It never knows what it is rendering — it owns the box and the pointer maths, then
        hands the numbers to a function and gets out of the way.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        A hook would deliver the same coordinates more directly, which is why most render
        props became hooks. This one earns its keep because it also owns the element the
        listener is attached to, and a hook cannot render anything.
      </p>
    </div>
  );
}
