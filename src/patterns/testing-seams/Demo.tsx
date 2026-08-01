import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import {
  ClockContext,
  fixedClock,
  greetingFor,
  systemClock,
  useClock,
} from "./clock";

const CASES = [
  { label: "09:00", iso: "2025-06-01T09:00:00" },
  { label: "14:00", iso: "2025-06-01T14:00:00" },
  { label: "21:00", iso: "2025-06-01T21:00:00" },
];

export default function Demo() {
  const [injected, setInjected] = useState(true);
  const [caseIndex, setCaseIndex] = useState(0);

  const clock = injected ? fixedClock(CASES[caseIndex].iso) : systemClock;

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="inject a fixed clock"
          checked={injected}
          onChange={setInjected}
        />
        {injected && (
          <Knobs.Choice
            label="Time"
            value={String(caseIndex)}
            onChange={(next) => setCaseIndex(Number(next))}
            options={CASES.map((c, index) => ({
              value: String(index),
              label: c.label,
            }))}
          />
        )}
      </Knobs>

      <ClockContext value={clock}>
        <Greeting />
      </ClockContext>

      <div className="space-y-1 rounded-md border border-line p-3">
        <p className="u-label text-[9.5px] text-muted">All three cases, deterministically</p>
        {CASES.map((testCase) => (
          <p key={testCase.iso} className="font-mono text-[11px] text-fg">
            {testCase.label} → {greetingFor(new Date(testCase.iso), "Ada")}
          </p>
        ))}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The greeting depends on the time of day. Called directly,{" "}
        <code className="text-fg">Date.now()</code> makes that untestable — the assertion
        depends on when it ran, so a test passes in the afternoon and fails at nine in the
        evening. Injecting the clock makes all three cases reachable at once.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Note the default is the real clock, so production code needs no provider and nobody
        pays for testability they are not using. The seam is free until someone uses it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        This is why dependency injection beats module mocking. A mock reaches into another
        module's internals and breaks when that module is refactored, even though nothing
        it tested changed. A seam is part of the component's own interface — visible in the
        signature, checked by the compiler, and impossible to get silently out of date.
      </p>
    </div>
  );
}

function Greeting() {
  const clock = useClock();

  return (
    <div className="rounded-md border border-line p-4">
      <p className="text-[16px] text-fg">{greetingFor(clock.now(), "Ada")}</p>
      <p className="mt-1 font-mono text-[10px] text-muted">
        clock reports {clock.now().toTimeString().slice(0, 5)}
      </p>
    </div>
  );
}
