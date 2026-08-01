import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { chain, makeMiddlewares } from "./middleware";
import type { Middleware } from "./middleware";

const NAMES = ["logger", "validator", "funds", "rounder"] as const;
type Name = (typeof NAMES)[number];

export default function Demo() {
  const [enabled, setEnabled] = useState<Record<Name, boolean>>({
    logger: true,
    validator: true,
    funds: true,
    rounder: true,
  });
  const [amount, setAmount] = useState(40);
  const [balance, setBalance] = useState(100);
  const [entries, log] = useEventLog();

  function withdraw() {
    const built = makeMiddlewares(log.add);
    const active: Middleware[] = NAMES.filter((name) => enabled[name]).map(
      (name) => built[name],
    );

    const result = chain(active)({ type: "withdraw", amount }, { balance });

    if (result === null) {
      log.add("action stopped by the chain", "warn");
      return;
    }

    setBalance((current) => current - (result.amount ?? 0));
    log.add(`applied withdraw ${result.amount}`, "accent");
  }

  return (
    <div className="space-y-4">
      <Knobs>
        {NAMES.map((name) => (
          <Knobs.Toggle
            key={name}
            label={name}
            checked={enabled[name]}
            onChange={(next) => setEnabled((e) => ({ ...e, [name]: next }))}
          />
        ))}
      </Knobs>

      <Knobs>
        <Knobs.Range
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={-20}
          max={160}
          step={10}
        />
        <Knobs.Action label="Withdraw" onClick={withdraw} />
        <Knobs.Readout label="balance">{balance}</Knobs.Readout>
        <Knobs.Action label="Reset" onClick={() => setBalance(100)} />
      </Knobs>

      <EventLog entries={entries} onClear={log.clear} title="Chain" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Try withdrawing a negative amount, or more than the balance. The validator and the
        funds check stop the action by simply never calling{" "}
        <code className="text-fg">next</code> — nothing downstream is told, because nothing
        downstream runs.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Turn the validator off and the same negative amount sails through. Each link is
        independent, order matters, and any of them can veto or rewrite the action on the
        way past. This is the exact shape of Redux middleware and of every HTTP framework
        you have used.
      </p>
    </div>
  );
}
