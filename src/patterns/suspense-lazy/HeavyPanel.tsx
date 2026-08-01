import { PEOPLE } from "../../lab/data";

/**
 * Default-exported because `lazy()` expects a module whose `default` is the component.
 *
 * Vite splits this file into its own chunk, which the browser only downloads when this
 * component is first rendered — that is the entire point of code splitting, and the
 * reason `lazy` exists.
 */
export default function HeavyPanel() {
  return (
    <div className="rounded border border-line p-3">
      <p className="font-mono text-[11px] text-muted">Team panel</p>
      <ul className="mt-2 space-y-0.5">
        {PEOPLE.slice(0, 4).map((person) => (
          <li key={person.id} className="text-[13px] text-fg">
            {person.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
