import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { CompiledParent, MemoParent, PlainParent } from "./variants";

export default function Demo() {
  const [cost, setCost] = useState(12);
  const [stable, setStable] = useState(true);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="memo() child gets a stable callback"
          checked={stable}
          onChange={setStable}
        />
        <Knobs.Range
          label="Child cost"
          value={cost}
          onChange={setCost}
          min={0}
          max={60}
          step={4}
          unit="ms"
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-3">
        <PlainParent cost={cost} />
        <MemoParent cost={cost} stable={stable} />
        <CompiledParent cost={cost} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Each card re-renders only its own parent. In the first, the child's count climbs in
        step — a parent without memoisation builds a fresh element every render, so React
        re-renders the child even though nothing it shows has changed.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The second wraps the child in <code className="text-fg">memo</code>, and its count
        stays at one — while the callback is stable. Turn that knob off and it climbs like
        the first, because <code className="text-fg">memo</code> still compares the props
        and now never finds them equal. That is memoisation costing a comparison and buying
        nothing, and it is extremely common.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The third has no <code className="text-fg">memo</code> at all and its child still
        holds at one. Worth being precise about why: React Compiler does not make a{" "}
        <em>child</em> skip renders. It memoises the JSX this <em>parent</em> creates, so
        React receives the identical element and never descends into it. The saving comes
        from above, which is why the first two cards need{" "}
        <code className="text-fg">"use no memo"</code> on the parent to demonstrate
        anything — with the compiler on, all three behave like the third.
      </p>
    </div>
  );
}
