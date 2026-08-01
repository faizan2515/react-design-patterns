import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { AddTodo, TodoList, TodoStats } from "./parts";
import { StoreProvider } from "./StoreProvider";

export default function Demo() {
  const [split, setSplit] = useState(true);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="split state and dispatch contexts"
          checked={split}
          onChange={setSplit}
        />
      </Knobs>

      {/* Remounting on the toggle resets the counters, so each design is judged fresh. */}
      <StoreProvider key={String(split)} split={split}>
        <div className="grid gap-3 sm:grid-cols-3">
          <AddTodo />
          <TodoList />
          <TodoStats />
        </div>
      </StoreProvider>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        None of these three components receives a prop — they reach the store directly.
        Tick a todo and watch <code className="text-fg">AddTodo</code>, which only ever
        dispatches. Split, its counter stays put, because <code className="text-fg">dispatch</code>{" "}
        never changes identity. Combined, the context value is a fresh{" "}
        <code className="text-fg">{"{ state, dispatch }"}</code> on every change, so it
        re-renders along with everything else for no benefit.
      </p>
    </div>
  );
}
