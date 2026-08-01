import type { ReactNode } from "react";
import { PEOPLE } from "../../lab/data";
import { RenderBadge } from "../../lab/RenderBadge";
import { Slow } from "../../lab/Slow";

/** Shared chrome so the three variants differ only in where state lives. */
export function Panel({
  title,
  renders,
  children,
}: {
  title: string;
  renders: number;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-md border border-line p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-muted">{title}</span>
        <RenderBadge label="parent" count={renders} highlight />
      </div>
      {children}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Type to filter…"
      aria-label="Filter people"
      className="w-full rounded border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[12px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
    />
  );
}

/**
 * An expensive component that has nothing to do with the search box. Whether it re-renders
 * on every keystroke is the entire question this pattern asks.
 */
export function Sibling({ cost }: { cost: number }) {
  return <Slow ms={cost} label="Expensive sibling" />;
}

export function Results({ query }: { query: string }) {
  const matches = PEOPLE.filter((person) =>
    person.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <p className="font-mono text-[11px] text-muted">
      {matches.length} of {PEOPLE.length} people match
    </p>
  );
}
