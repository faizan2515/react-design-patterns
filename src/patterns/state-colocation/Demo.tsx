import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Colocated, LiftedCompiled, LiftedUncompiled } from "./variants";

type Variant = "uncompiled" | "compiled" | "colocated";

const VARIANTS = [
  { value: "uncompiled", label: "Lifted (no compiler)" },
  { value: "compiled", label: "Lifted (compiled)" },
  { value: "colocated", label: "Colocated" },
] as const;

export default function Demo() {
  const [variant, setVariant] = useState<Variant>("uncompiled");
  const [cost, setCost] = useState(20);

  return (
    <div className="space-y-5">
      <Knobs>
        <Knobs.Choice
          label="State lives"
          value={variant}
          onChange={setVariant}
          options={VARIANTS}
        />
        <Knobs.Range
          label="Sibling cost"
          value={cost}
          onChange={setCost}
          min={0}
          max={60}
          step={4}
          unit="ms"
        />
      </Knobs>

      {/* Switching variants remounts the panel, so each one starts counting from zero. */}
      {variant === "uncompiled" && <LiftedUncompiled key="a" cost={cost} />}
      {variant === "compiled" && <LiftedCompiled key="b" cost={cost} />}
      {variant === "colocated" && <Colocated key="c" cost={cost} />}

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Type in the box and watch the counters. Raise the sibling cost until you can feel
        the difference — the counts tell you what is re-rendering, the lag tells you what
        it costs.
      </p>
    </div>
  );
}
