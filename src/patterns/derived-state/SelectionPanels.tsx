import { useState } from "react";
import type { Person } from "../../lab/data";

/**
 * Selection stored as a copy of the object.
 *
 * The moment the list is edited, this copy is a snapshot of a person who no longer exists
 * in that form. Nothing errors — the panel just quietly shows the old role, and it keeps
 * showing it until something happens to reselect.
 *
 * The instinct at this point is to add an effect that re-syncs the copy when the list
 * changes. That is a second source of truth plus machinery to paper over having two.
 */
export function CopyPanel({ people }: { people: Person[] }) {
  const [selected, setSelected] = useState<Person | null>(null);

  return (
    <Panel
      title="stores the object"
      people={people}
      isSelected={(person) => selected?.id === person.id}
      onSelect={setSelected}
      detail={selected}
    />
  );
}

/**
 * Selection stored as an id, with the object derived during render.
 *
 * There is only one copy of a person anywhere in this component, so there is nothing to
 * fall out of sync. Editing the list updates the panel on the very next render, with no
 * effect and no extra state.
 */
export function DerivedPanel({ people }: { people: Person[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Derived during render, not stored. Cheap, and correct by construction.
  const selected = people.find((person) => person.id === selectedId) ?? null;

  return (
    <Panel
      title="stores the id"
      people={people}
      isSelected={(person) => person.id === selectedId}
      onSelect={(person) => setSelectedId(person.id)}
      detail={selected}
    />
  );
}

function Panel({
  title,
  people,
  isSelected,
  onSelect,
  detail,
}: {
  title: string;
  people: Person[];
  isSelected: (person: Person) => boolean;
  onSelect: (person: Person) => void;
  detail: Person | null;
}) {
  return (
    <div className="space-y-2 rounded border border-line p-3">
      <p className="font-mono text-[11px] text-muted">{title}</p>

      <ul className="space-y-0.5">
        {people.map((person) => (
          <li key={person.id}>
            <button
              type="button"
              onClick={() => onSelect(person)}
              className={`w-full rounded px-2 py-1 text-left text-[13px] transition-colors ${
                isSelected(person)
                  ? "bg-accent-soft text-fg"
                  : "text-muted hover:text-fg"
              }`}
            >
              {person.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="rounded border border-line bg-surface-2 px-2.5 py-2">
        {detail ? (
          <>
            <p className="text-[13px] text-fg">{detail.name}</p>
            <p className="font-mono text-[11px] text-muted">{detail.role}</p>
          </>
        ) : (
          <p className="font-mono text-[11px] text-muted">Nothing selected</p>
        )}
      </div>
    </div>
  );
}
