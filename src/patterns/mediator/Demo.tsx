import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";

const FILTERS = ["all", "platform", "design"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Mediator: siblings that must coordinate talk to one component that knows the rules,
 * rather than to each other.
 *
 * Without it, the filter bar needs a reference to the list, the list needs to tell the
 * summary, and the summary needs to know when a reset happened — three components with
 * six relationships. With it, each one reports upward and reads downward, and the rules
 * about how they interact live in a single place you can read.
 *
 * React's default data flow is already this pattern; recognising it is what stops you
 * reaching for an event bus the moment two siblings need to agree on something.
 */
export default function Demo() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [entries, log] = useEventLog();

  const items = [
    { id: "a", name: "Deploy pipeline", team: "platform" },
    { id: "b", name: "Design tokens", team: "design" },
    { id: "c", name: "Auth service", team: "platform" },
    { id: "d", name: "Icon set", team: "design" },
  ];

  const visible = items.filter(
    (item) => filter === "all" || item.team === filter,
  );

  /* The rule the siblings would otherwise have to negotiate between themselves. */
  function changeFilter(next: Filter) {
    setFilter(next);
    const stillVisible = items
      .filter((item) => next === "all" || item.team === next)
      .map((item) => item.id);

    setSelected((current) => {
      const kept = current.filter((id) => stillVisible.includes(id));
      if (kept.length !== current.length) {
        log.add(
          `mediator dropped ${current.length - kept.length} hidden selection(s)`,
          "warn",
        );
      }
      return kept;
    });
    log.add(`filter → ${next}`, "accent");
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Filter"
          value={filter}
          onChange={changeFilter}
          options={FILTERS.map((f) => ({ value: f, label: f }))}
        />
        <Knobs.Readout label="selected">{selected.length}</Knobs.Readout>
      </Knobs>

      <ul className="divide-y divide-line rounded-md border border-line">
        {visible.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-[13px] text-fg">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() =>
                  setSelected((current) =>
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id],
                  )
                }
                className="accent-accent"
              />
              <span className="flex-1">{item.name}</span>
              <span className="font-mono text-[10px] text-muted">{item.team}</span>
            </label>
          </li>
        ))}
      </ul>

      <EventLog entries={entries} onClear={log.clear} title="Coordination" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Select something from the platform team, then filter to design. The selection is
        dropped, because a hidden row cannot stay selected — a rule that involves the
        filter, the list and the summary, and belongs to none of them.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Without a mediator these three would need references to each other: six
        relationships instead of three, and the rule scattered across all of them. Here it
        lives in one function you can read top to bottom.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        React's ordinary parent-owns-state flow is already this pattern. Recognising that
        is what stops you reaching for an event bus the moment two siblings need to agree —
        and the point at which the mediator itself grows too big is the point to move it
        into a reducer or a store.
      </p>
    </div>
  );
}
