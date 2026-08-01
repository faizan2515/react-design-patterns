import type { ReactNode } from "react";

/**
 * The control rail that drives a demo.
 *
 * Built as a compound component — `<Knobs><Knobs.Toggle /></Knobs>` — for two reasons:
 * it keeps the markup declarative at each call site, and it means the lab kit itself
 * demonstrates pattern #5 rather than only describing it.
 *
 * Every control is controlled: the demo owns the state and passes it down. That keeps
 * the state visible in the demo's own source, which is the file people came to read.
 */
export function Knobs({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-md border border-line bg-surface-2 px-3 py-2.5">
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-accent"
      />
      {label}
    </label>
  );
}

function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <label className="flex items-center gap-2 font-mono text-[11px] text-muted">
      {label}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-28 accent-accent"
      />
      <span className="w-14 tabular-nums text-fg">
        {value}
        {unit}
      </span>
    </label>
  );
}

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (next: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
      {label}
      <span className="flex rounded border border-line p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
            className={`rounded px-2 py-0.5 transition-colors ${
              option.value === value
                ? "bg-accent-soft text-fg"
                : "hover:text-fg"
            }`}
          >
            {option.label}
          </button>
        ))}
      </span>
    </span>
  );
}

function Action({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
    >
      {label}
    </button>
  );
}

function Readout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
      {label}
      <span className="tabular-nums text-fg">{children}</span>
    </span>
  );
}

Knobs.Toggle = Toggle;
Knobs.Range = Range;
Knobs.Choice = Choice;
Knobs.Action = Action;
Knobs.Readout = Readout;
