import { useState } from "react";
import { PEOPLE } from "../../lab/data";
import type { Person } from "../../lab/data";
import { Knobs } from "../../lab/Knobs";
import { CopyPanel, DerivedPanel } from "./SelectionPanels";

const START = PEOPLE.slice(0, 4);

export default function Demo() {
  const [people, setPeople] = useState<Person[]>(START);
  const [promotions, setPromotions] = useState(0);

  /* Stands in for anything that updates the underlying data: a save, a refetch, a socket. */
  function promoteEveryone() {
    setPeople((list) =>
      list.map((person) => ({ ...person, role: `Senior ${person.role}` })),
    );
    setPromotions((n) => n + 1);
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action label="Promote everyone" onClick={promoteEveryone} />
        <Knobs.Action
          label="Reset"
          onClick={() => {
            setPeople(START);
            setPromotions(0);
          }}
        />
        <Knobs.Readout label="updates">{promotions}</Knobs.Readout>
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <CopyPanel people={people} />
        <DerivedPanel people={people} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Select the same person in both panels, then promote everyone. The left panel keeps
        showing the role it copied at selection time — it is displaying a person who no
        longer exists. The right panel stored only the id and looked the person up during
        render, so there was never a second copy to go stale.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The general rule: if a value can be computed from something you already have, do
        not also store it. Every duplicate is a thing that can disagree.
      </p>
    </div>
  );
}
