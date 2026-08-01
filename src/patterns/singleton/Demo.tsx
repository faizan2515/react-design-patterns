import { useSyncExternalStore } from "react";
import { Knobs } from "../../lab/Knobs";
import { appConfig } from "./config";

const REGIONS = ["eu-west", "us-east", "ap-south"];

function useConfig() {
  return useSyncExternalStore(appConfig.subscribe, appConfig.get, appConfig.get);
}

export default function Demo() {
  const config = useConfig();

  return (
    <div className="space-y-4">
      <Knobs>
        {REGIONS.map((region) => (
          <Knobs.Action
            key={region}
            label={region}
            onClick={() => appConfig.setRegion(region)}
          />
        ))}
        <Knobs.Action label="record request" onClick={appConfig.recordRequest} />
        <Knobs.Action label="Reset" onClick={appConfig.reset} />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <Reader name="Header" />
        <Reader name="Footer" />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both panels import the same module and see the same values — no provider, no props.
        Module evaluation is cached, and that caching is the entire singleton. There is no
        class and no <code className="text-fg">getInstance()</code>.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Convenience with two sharp edges. On a server this object is shared by every
        request and every user, so anything user-specific put here leaks between them —
        a data-protection bug rather than a performance one. And in tests it survives
        between cases, so one test's writes become the next one's starting state and
        failures start depending on file order.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Both are fixed the same way: create the instance per request or per test and pass
        it down. A singleton is fine for genuinely global, immutable configuration; it is a
        trap for anything that varies by user. Current region:{" "}
        <span className="text-fg">{config.region}</span>.
      </p>
    </div>
  );
}

function Reader({ name }: { name: string }) {
  const config = useConfig();

  return (
    <div className="space-y-1 rounded-md border border-line p-3">
      <p className="font-mono text-[11px] text-muted">{name}</p>
      <p className="font-mono text-[15px] text-fg">{config.region}</p>
      <p className="font-mono text-[10px] text-muted">
        {config.requests} requests recorded
      </p>
    </div>
  );
}
