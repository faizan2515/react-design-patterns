import { useMemo, useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { ContextTree } from "./ContextTree";
import { DrilledTree } from "./DrilledTree";
import { SettingsContext } from "./settingsContext";
import type { Density } from "./settingsContext";

const DENSITIES = [
  { value: "compact", label: "Compact" },
  { value: "cosy", label: "Cosy" },
  { value: "roomy", label: "Roomy" },
] as const;

export default function Demo() {
  const [density, setDensity] = useState<Density>("cosy");

  /*
    A new object every render would be a new context value every render, re-rendering
    every consumer whether or not anything changed. Memoising it is not an optimisation
    here — it is what makes the context correct.
  */
  const settings = useMemo(() => ({ density, setDensity }), [density]);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Density"
          value={density}
          onChange={setDensity}
          options={DENSITIES}
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Prop drilling</p>
          <DrilledTree density={density} />
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Context</p>
          {/* React 19 renders the context itself as the provider — no `.Provider`. */}
          <SettingsContext value={settings}>
            <ContextTree />
          </SettingsContext>
        </div>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Change the density and compare the counters. On the left every level re-renders,
        because every level received a prop that changed. On the right only the leaf does —
        the levels above it never read the value, so React has no reason to touch them.
      </p>
    </div>
  );
}
