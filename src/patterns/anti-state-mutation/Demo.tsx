import { useState } from "react";
import { Knobs } from "../../lab/Knobs";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const SEED: Todo[] = [
  { id: 1, text: "Read the source", done: false },
  { id: 2, text: "Press both buttons", done: false },
  { id: 3, text: "Notice only one works", done: false },
];

export default function Demo() {
  const [mutated, setMutated] = useState<Todo[]>(SEED);
  const [copied, setCopied] = useState<Todo[]>(SEED);
  const [nudge, setNudge] = useState(0);

  /* ✗ Mutates the existing array and hands React the same reference back. */
  function toggleByMutation(id: number) {
    const todo = mutated.find((item) => item.id === id);
    if (todo) todo.done = !todo.done;
    setMutated(mutated);
  }

  /* ✓ Produces a new array containing a new object for the changed row. */
  function toggleByCopy(id: number) {
    setCopied((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action
          label="force a re-render"
          onClick={() => setNudge((n) => n + 1)}
        />
        <Knobs.Readout label="forced renders">{nudge}</Knobs.Readout>
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <List
          title="✗ mutated in place"
          todos={mutated}
          onToggle={toggleByMutation}
          broken
        />
        <List title="✓ replaced with a copy" todos={copied} onToggle={toggleByCopy} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Click items in both lists. The left one appears completely dead. Now press “force a
        re-render” — and the ticks you made earlier suddenly appear, all at once.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        That is the giveaway. The data <em>did</em> change; React just never found out.
        It compares by reference, and the array handed to{" "}
        <code className="text-fg">setMutated</code> is the same array it already had, so
        there was nothing to re-render. The change was sitting there the whole time,
        waiting for some unrelated render to reveal it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        This is what makes mutation bugs expensive: they do not throw, and they do not
        consistently fail. They produce a UI that is correct except when it is not, and the
        reproduction depends on what else happened to render.
      </p>
    </div>
  );
}

function List({
  title,
  todos,
  onToggle,
  broken,
}: {
  title: string;
  todos: Todo[];
  onToggle: (id: number) => void;
  broken?: boolean;
}) {
  return (
    <div
      className={`space-y-2 rounded-md border p-3 ${
        broken ? "border-accent-line" : "border-line"
      }`}
    >
      <p className="font-mono text-[11px] text-muted">{title}</p>
      <ul className="space-y-1">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-fg">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
                className="accent-accent"
              />
              <span className={todo.done ? "text-muted line-through" : undefined}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
