import { useCallback, useState } from "react";
import { useRenderCount } from "../../lab/useRenderCount";
import { Card, Child, MemoChild } from "./parts";

/**
 * A parent with the compiler switched off — plain React.
 *
 * Each render builds a fresh `<Child />` element, so React re-renders the child even
 * though nothing it displays has changed. This is the behaviour every article about
 * `memo` is written against.
 */
export function PlainParent({ cost }: { cost: number }) {
  "use no memo";

  const [bumps, setBumps] = useState(0);
  const renders = useRenderCount();
  const onPing = useCallback(() => {}, []);

  return (
    <Card
      title="No compiler, no memo"
      note="fresh element every render → child re-renders"
      parentRenders={renders}
      bumps={bumps}
      onBump={() => setBumps((n) => n + 1)}
    >
      <Child cost={cost} onPing={onPing} />
    </Card>
  );
}

/**
 * Compiler off, but the child is wrapped in `memo` — and only works while the props it
 * receives are stable. The `stable` knob is what makes that visible.
 */
export function MemoParent({
  cost,
  stable,
}: {
  cost: number;
  stable: boolean;
}) {
  "use no memo";

  const [bumps, setBumps] = useState(0);
  const renders = useRenderCount();

  const stableCallback = useCallback(() => {}, []);
  const freshCallback = () => {};
  const onPing = stable ? stableCallback : freshCallback;

  return (
    <Card
      title="No compiler, memo() child"
      note={
        stable
          ? "stable props → memo skips the render"
          : "new function each render → memo compares and re-renders anyway"
      }
      parentRenders={renders}
      bumps={bumps}
      onBump={() => setBumps((n) => n + 1)}
    >
      <MemoChild cost={cost} onPing={onPing} />
    </Card>
  );
}

/**
 * The same code as the first card, with the compiler left on.
 *
 * This is the correction worth internalising: the compiler does not make a *child* skip
 * renders. It memoises the JSX this parent creates, so when nothing the child depends on
 * has changed, React receives the identical element and never descends into it. The saving
 * comes from the parent, which is why opting the child out changes nothing here.
 */
export function CompiledParent({ cost }: { cost: number }) {
  const [bumps, setBumps] = useState(0);
  const renders = useRenderCount();
  const onPing = useCallback(() => {}, []);

  return (
    <Card
      title="Compiler on, no memo"
      note="parent's JSX is memoised → identical element → child skipped"
      parentRenders={renders}
      bumps={bumps}
      onBump={() => setBumps((n) => n + 1)}
    >
      <Child cost={cost} onPing={onPing} />
    </Card>
  );
}
