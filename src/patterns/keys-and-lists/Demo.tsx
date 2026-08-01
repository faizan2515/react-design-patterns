import { useState } from "react";
import { PEOPLE } from "../../lab/data";
import type { Person } from "../../lab/data";
import { Knobs } from "../../lab/Knobs";
import { ProfileEditor } from "./ProfileEditor";
import { ReorderList } from "./ReorderList";

const KEY_OPTIONS = [
  { value: "index", label: "key={index}" },
  { value: "id", label: "key={person.id}" },
] as const;

const START = PEOPLE.slice(0, 4);

export default function Demo() {
  const [keyBy, setKeyBy] = useState<"index" | "id">("index");
  const [people, setPeople] = useState<Person[]>(START);

  const [selected, setSelected] = useState(0);
  const [resetByKey, setResetByKey] = useState(false);
  const person = PEOPLE[selected];

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Knobs>
          <Knobs.Choice
            label="Key"
            value={keyBy}
            onChange={setKeyBy}
            options={KEY_OPTIONS}
          />
          <Knobs.Action
            label="Move first to last"
            onClick={() => setPeople((list) => [...list.slice(1), list[0]])}
          />
          <Knobs.Action label="Reset list" onClick={() => setPeople(START)} />
        </Knobs>

        {/* Remounting on key-strategy change clears the notes, so each run starts clean. */}
        <ReorderList key={keyBy} people={people} keyBy={keyBy} />

        <p className="text-[13px] leading-relaxed text-muted">
          Type a note next to a couple of people, then move the first row to the end. With{" "}
          <code className="text-fg">key={"{index}"}</code> the notes stay at their
          positions and end up beside the wrong people. Switch to the id and try again —
          the notes travel with the row they belong to.
        </p>
      </section>

      <section className="space-y-3 border-t border-line pt-6">
        <Knobs>
          <Knobs.Choice
            label="Person"
            value={String(selected)}
            onChange={(next) => setSelected(Number(next))}
            options={PEOPLE.slice(0, 3).map((p, index) => ({
              value: String(index),
              label: p.name.split(" ")[0],
            }))}
          />
          <Knobs.Toggle
            label="key={person.id}"
            checked={resetByKey}
            onChange={setResetByKey}
          />
        </Knobs>

        <ProfileEditor
          key={resetByKey ? person.id : undefined}
          person={person}
        />

        <p className="text-[13px] leading-relaxed text-muted">
          Edit the role, then switch person. Without a key the draft follows you across —
          one person's name above another's edits. Turn the key on and switching gives you
          a fresh component, because a changed key tells React this is a different thing,
          not the same thing with new props.
        </p>
      </section>
    </div>
  );
}
