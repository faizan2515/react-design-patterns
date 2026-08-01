import { useState, useSyncExternalStore } from "react";
import { Knobs } from "../../lab/Knobs";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import { clockStore } from "./clockStore";

/**
 * One line to bridge a non-React store into React.
 *
 * This is the officially supported way, and it exists for a reason: a naive
 * `useEffect` + `setState` subscription can miss updates that happen between render and
 * effect, and tears under concurrent rendering — two components reading the same store in
 * one paint and disagreeing.
 */
function useClock() {
  return useSyncExternalStore(clockStore.subscribe, clockStore.getSnapshot);
}

export default function Demo() {
  const [second, setSecond] = useState(true);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action label="start" onClick={() => clockStore.start()} />
        <Knobs.Action label="stop" onClick={() => clockStore.stop()} />
        <Knobs.Action label="reset" onClick={() => clockStore.reset()} />
        <Knobs.Toggle
          label="second subscriber"
          checked={second}
          onChange={setSecond}
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <Readout name="Subscriber A" />
        {second && <Readout name="Subscriber B" />}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The clock lives in a plain module with no React in it. Both readouts show the same
        value at the same moment because they read one shared source rather than each
        keeping a copy in sync. Unmount the second one and the store drops its listener —
        the subscription is tied to the component, not the module.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The trap is <code className="text-fg">getSnapshot</code>. It must return the same
        reference when nothing has changed, so this store caches its snapshot and rebuilds
        it only on a real update. Returning{" "}
        <code className="text-fg">{"{ ticks, running }"}</code> fresh on every call makes
        React see a change on every render and loop until it errors.
      </p>
    </div>
  );
}

function Readout({ name }: { name: string }) {
  const { ticks, running } = useClock();
  const renders = useRenderCount();

  return (
    <div className="space-y-2 rounded-md border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{name}</span>
        <RenderBadge count={renders} />
      </div>
      <p className="font-mono text-[22px] tabular-nums text-fg">{ticks}</p>
      <p className="font-mono text-[10px] text-muted">
        {running ? "running" : "stopped"} · {clockStore.listenerCount()} listeners
      </p>
    </div>
  );
}
