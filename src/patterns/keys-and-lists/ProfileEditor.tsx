import { useState } from "react";
import type { Person } from "../../lab/data";

/**
 * A component whose state is seeded from a prop.
 *
 * `useState(person.role)` is an *initial* value — it runs on mount and is ignored on
 * every later render. Point this component at a different person and the draft stays
 * behind, showing one person's name above another's unsaved edits.
 *
 * The fix is not an effect that copies props into state. It is to tell React this is a
 * different component instance, by giving it a different `key`.
 */
export function ProfileEditor({ person }: { person: Person }) {
  const [draft, setDraft] = useState(person.role);

  const dirty = draft !== person.role;

  return (
    <div className="space-y-2 rounded border border-line p-3">
      <p className="font-mono text-[11px] text-muted">{person.name}</p>

      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label="Role"
        className="w-full rounded border border-line bg-surface-2 px-2 py-1 font-mono text-[12px] text-fg focus:border-accent-line focus:outline-none"
      />

      <p className="font-mono text-[10px] text-muted">
        saved role: {person.role}
        {dirty && <span className="ml-2 text-accent">draft differs</span>}
      </p>
    </div>
  );
}
