import { useBetaFeatures, useDarkMode, useNotifications } from "./factories";

export default function Demo() {
  const dark = useDarkMode();
  const beta = useBetaFeatures();
  const notify = useNotifications();

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-md border border-line p-3">
        {[dark, beta, notify].map((setting) => (
          <label
            key={setting.label}
            className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-fg"
          >
            {setting.label}
            <input
              type="checkbox"
              checked={setting.on}
              onChange={setting.toggle}
              className="accent-accent"
            />
          </label>
        ))}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Three independent settings hooks, all produced by one factory that closed over a
        default and a label. Each call site gets its own state, exactly as it would from a
        hand-written hook — the factory only saved the repetition.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The rule that matters: call the factory at module scope, not during render. For a
        hook that would merely be wasteful; for a component factory it is a bug, because
        React sees a new component type every render and remounts the entire subtree,
        discarding its state. It is the same reason{" "}
        <code className="text-fg">withAccess(Profile)</code> belongs outside the component
        that renders it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        In class languages Factory exists to hide which subclass you get. In JavaScript
        functions already return whatever they like, so the pattern shows up as
        configuration capture — <code className="text-fg">createStore</code>,{" "}
        <code className="text-fg">createContext</code>,{" "}
        <code className="text-fg">createBrowserRouter</code> are all this.
      </p>
    </div>
  );
}
