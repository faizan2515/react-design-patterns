import type { Person } from "../../lab/data";

/**
 * Each row holds an uncontrolled input, so its value lives in the DOM rather than in
 * React state. That is what makes the bug visible: React uses keys to decide which DOM
 * node belongs to which item, and an index key says "this node belongs to position 2"
 * rather than "this node belongs to Grace Hopper".
 *
 * Reorder the list and the notes stay behind at their positions, now attached to the
 * wrong people. Nothing warns you, because from React's point of view you asked for
 * exactly this.
 */
export function ReorderList({
  people,
  keyBy,
}: {
  people: Person[];
  keyBy: "index" | "id";
}) {
  return (
    <ul className="divide-y divide-line rounded border border-line">
      {people.map((person, index) => (
        <li
          key={keyBy === "index" ? index : person.id}
          className="flex items-center gap-3 px-2.5 py-2"
        >
          <span className="w-6 font-mono text-[10px] text-muted">{index}</span>
          <span className="flex-1 truncate text-[13px] text-fg">{person.name}</span>
          <input
            defaultValue=""
            placeholder="note…"
            aria-label={`Note for ${person.name}`}
            className="w-28 rounded border border-line bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
          />
        </li>
      ))}
    </ul>
  );
}
