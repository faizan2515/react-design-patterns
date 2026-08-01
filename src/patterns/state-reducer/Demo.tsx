import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { POLICIES, POLICY_LABELS } from "./policies";
import type { PolicyId } from "./policies";
import { useToggle } from "./useToggle";

const OPTIONS = (Object.keys(POLICIES) as PolicyId[]).map((id) => ({
  value: id,
  label: POLICY_LABELS[id],
}));

export default function Demo() {
  const [policy, setPolicy] = useState<PolicyId>("default");

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Caller's rules"
          value={policy}
          onChange={setPolicy}
          options={OPTIONS}
        />
      </Knobs>

      {/* Remounted per policy so each starts from a clean state. */}
      <Toggle key={policy} policy={policy} />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The toggle has no idea any of these rules exist. It ships one reducer and accepts a
        replacement, so a caller can veto a transition, cap it, or rewrite it — without the
        component growing a <code className="text-fg">maxToggles</code> prop, then a{" "}
        <code className="text-fg">disableOff</code> prop, then the next one after that.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Control props hand the caller the value. This hands them the rules. The cost is
        that your reducer and its action names become public API — renaming an action is
        now a breaking change.
      </p>
    </div>
  );
}

function Toggle({ policy }: { policy: PolicyId }) {
  const { on, changes, toggle, reset } = useToggle(POLICIES[policy]);

  return (
    <div className="space-y-3 rounded-md border border-line p-4">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className={`relative h-7 w-12 rounded-full border transition-colors ${
          on ? "border-accent-line bg-accent" : "border-line bg-surface-2"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-bg transition-all ${
            on ? "left-6" : "left-0.5"
          }`}
        />
        <span className="sr-only">Toggle</span>
      </button>

      <div className="flex items-center gap-4 font-mono text-[11px] text-muted">
        <span>
          state: <span className="text-fg">{on ? "on" : "off"}</span>
        </span>
        <span>
          changes: <span className="text-fg tabular-nums">{changes}</span>
        </span>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-line px-2 py-0.5 transition-colors hover:border-accent-line hover:text-fg"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
