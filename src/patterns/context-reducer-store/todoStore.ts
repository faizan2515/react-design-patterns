export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export interface TodoState {
  todos: Todo[];
  nextId: number;
}

export type TodoAction =
  | { type: "added"; text: string }
  | { type: "toggled"; id: number }
  | { type: "clearedCompleted" };

export const INITIAL: TodoState = {
  todos: [
    { id: 1, text: "Read the source below", done: false },
    { id: 2, text: "Watch the render counts", done: false },
  ],
  nextId: 3,
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "added":
      return {
        todos: [
          ...state.todos,
          { id: state.nextId, text: action.text, done: false },
        ],
        nextId: state.nextId + 1,
      };

    case "toggled":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo,
        ),
      };

    case "clearedCompleted":
      return { ...state, todos: state.todos.filter((todo) => !todo.done) };
  }
}
