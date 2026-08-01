import { useSyncExternalStore } from "react";
import { Knobs } from "../../lab/Knobs";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import { reactive } from "./reactive";

const store = reactive({ count: 0, label: "draft" });

/**
 * Subscribing to the version rather than the state, because the proxy's identity never
 * changes — a snapshot that returned the object itself would look unchanged forever.
 */
function useReactive() {
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);
  return store.state;
}

export default function Demo() {
  const state = useReactive();
  const renders = useRenderCount();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action
          label="state.count++"
          onClick={() => {
            store.state.count += 1;
          }}
        />
        <Knobs.Action
          label='state.label = "final"'
          onClick={() => {
            store.state.label = "final";
          }}
        />
        <Knobs.Action
          label="write the same value"
          onClick={() => {
            // Read first, then write it back: the trap compares and stays silent.
            const unchanged = store.state.label;
            store.state.label = unchanged;
          }}
        />
        <Knobs.Action
          label="Reset"
          onClick={() => {
            store.state.count = 0;
            store.state.label = "draft";
          }}
        />
      </Knobs>

      <div className="flex items-center gap-6 rounded-md border border-line p-4">
        <div>
          <p className="u-label text-[9.5px] text-muted">count</p>
          <p className="font-mono text-[26px] tabular-nums text-fg">
            {state.count}
          </p>
        </div>
        <div>
          <p className="u-label text-[9.5px] text-muted">label</p>
          <p className="font-mono text-[20px] text-fg">{state.label}</p>
        </div>
        <RenderBadge label="component" count={renders} highlight />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Those buttons mutate a plain object — <code className="text-fg">state.count++</code>{" "}
        — and the component re-renders anyway. A proxy intercepts the write and notifies,
        so mutation gets the ergonomics without React losing track. Writing the same value
        changes nothing, because the trap compares first.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        This is roughly how Valtio and MobX work, and the costs are worth naming. The trap
        catches writes, not deep reads, so nested objects need wrapping too. The proxy is
        not <code className="text-fg">===</code> its target. And since nothing produces a
        new reference, <code className="text-fg">memo</code> and dependency arrays lose the
        signal they rely on — which is exactly why those libraries ship their own
        subscription primitives instead of leaning on React's.
      </p>
    </div>
  );
}
