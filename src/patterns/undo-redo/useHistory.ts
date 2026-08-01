import { useCallback, useMemo, useReducer } from "react";

interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

type HistoryAction<T> =
  | { type: "commit"; value: T }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "clear" };

function reducer<T>(state: History<T>, action: HistoryAction<T>): History<T> {
  switch (action.type) {
    case "commit":
      // A new action invalidates the redo stack — the timeline branched, and the branch
      // you did not take is gone. Every editor behaves this way.
      return {
        past: [...state.past, state.present],
        present: action.value,
        future: [],
      };

    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case "redo": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
      };
    }

    case "clear":
      return { past: [], present: state.present, future: [] };
  }
}

/**
 * Undo/redo as three stacks: what came before, what is now, what was undone.
 *
 * This is the Memento pattern — each entry is a complete snapshot of state, so undoing is
 * just moving a value between stacks with nothing to reverse. The alternative is Command:
 * store the operations and their inverses, which is far more compact for large documents
 * and far more work, because every action needs an undo written and kept correct.
 *
 * Snapshots win whenever the state is small enough to copy, which for UI state it usually
 * is. Reach for commands when you are undoing edits to a 50MB document.
 */
export function useHistory<T>(initial: T) {
  const [state, dispatch] = useReducer(reducer<T>, {
    past: [],
    present: initial,
    future: [],
  });

  const commit = useCallback(
    (value: T) => dispatch({ type: "commit", value }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  return useMemo(
    () => ({
      present: state.present,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      depth: { past: state.past.length, future: state.future.length },
      commit,
      undo,
      redo,
      clear,
    }),
    [state, commit, undo, redo, clear],
  );
}
