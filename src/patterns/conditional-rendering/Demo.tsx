import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { FalsyTrap } from "./FalsyTrap";
import { StatusSwitch, StatusTernary } from "./StatusSwitch";
import type { Status } from "./StatusSwitch";

const STATUSES = [
  { value: "idle", label: "idle" },
  { value: "loading", label: "loading" },
  { value: "error", label: "error" },
  { value: "ready", label: "ready" },
] as const;

export default function Demo() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<Status>("idle");

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Knobs>
          <Knobs.Range
            label="Items"
            value={count}
            onChange={setCount}
            min={0}
            max={4}
          />
        </Knobs>

        <FalsyTrap count={count} />

        <p className="text-[13px] leading-relaxed text-muted">
          Drag the count to zero. The first box renders a literal{" "}
          <code className="text-fg">0</code>, because{" "}
          <code className="text-fg">0 && x</code> evaluates to{" "}
          <code className="text-fg">0</code>, and zero is something React is happy to put
          on screen.
        </p>
      </section>

      <section className="space-y-3 border-t border-line pt-6">
        <Knobs>
          <Knobs.Choice
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUSES}
          />
        </Knobs>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded border border-line p-2.5">
            <p className="font-mono text-[10px] text-muted">Lookup map</p>
            <div className="mt-2">
              <StatusSwitch status={status} />
            </div>
          </div>
          <div className="rounded border border-line p-2.5">
            <p className="font-mono text-[10px] text-muted">Nested ternaries</p>
            <div className="mt-2">
              <StatusTernary status={status} />
            </div>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed text-muted">
          Identical output. Read the two implementations in the source below and imagine
          adding a fifth status to each.
        </p>
      </section>
    </div>
  );
}
