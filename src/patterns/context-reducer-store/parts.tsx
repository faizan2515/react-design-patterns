import { useState } from "react";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import { useTodoDispatch, useTodoState } from "./storeContext";

/**
 * Dispatch only — it never reads a todo.
 *
 * With split contexts it subscribes to `dispatch`, which never changes, so ticking a todo
 * elsewhere leaves it alone. Combine the contexts and its counter climbs with every
 * change in the store, despite nothing it displays having changed.
 */
export function AddTodo() {
  const dispatch = useTodoDispatch();
  const renders = useRenderCount();
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        dispatch({ type: "added", text: text.trim() });
        setText("");
      }}
      className="space-y-2 rounded border border-line p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">AddTodo · dispatch only</span>
        <RenderBadge count={renders} highlight />
      </div>

      <div className="flex gap-1.5">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="New todo…"
          aria-label="New todo"
          className="min-w-0 flex-1 rounded border border-line bg-surface-2 px-2 py-1 font-mono text-[12px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
        />
        <button
          type="submit"
          className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
        >
          Add
        </button>
      </div>
    </form>
  );
}

/** Reads state, so it re-renders on every change under either design — correctly. */
export function TodoList() {
  const { todos } = useTodoState();
  const dispatch = useTodoDispatch();
  const renders = useRenderCount();

  return (
    <div className="space-y-2 rounded border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">TodoList · reads state</span>
        <RenderBadge count={renders} />
      </div>

      <ul className="space-y-1">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-fg">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => dispatch({ type: "toggled", id: todo.id })}
                className="accent-accent"
              />
              <span className={todo.done ? "text-muted line-through" : undefined}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-[13px] text-muted">Nothing left.</li>
        )}
      </ul>
    </div>
  );
}

/** Also reads state, from a completely different part of the tree. No props involved. */
export function TodoStats() {
  const { todos } = useTodoState();
  const dispatch = useTodoDispatch();
  const renders = useRenderCount();

  const done = todos.filter((todo) => todo.done).length;

  return (
    <div className="space-y-2 rounded border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">TodoStats · reads state</span>
        <RenderBadge count={renders} />
      </div>

      <p className="font-mono text-[12px] text-fg">
        {done} of {todos.length} done
      </p>

      <button
        type="button"
        onClick={() => dispatch({ type: "clearedCompleted" })}
        disabled={done === 0}
        className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg disabled:opacity-40"
      >
        Clear completed
      </button>
    </div>
  );
}
