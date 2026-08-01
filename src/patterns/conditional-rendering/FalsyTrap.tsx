import { PEOPLE } from "../../lab/data";

/**
 * The `&&` trap.
 *
 * `a && b` does not evaluate to a boolean — it evaluates to `a` when `a` is falsy. React
 * renders nothing for `false`, `null` and `undefined`, but `0` is a perfectly good thing
 * to render, so it appears on screen as the character "0".
 *
 * Empty strings are safe, `NaN` is not. The habit worth building is to make the left side
 * an actual boolean rather than to remember which falsy values are safe.
 */
export function FalsyTrap({ count }: { count: number }) {
  const items = PEOPLE.slice(0, count);

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Case
        label="items.length && …"
        broken={count === 0}
        note={count === 0 ? "renders a stray 0" : undefined}
      >
        {items.length && <List names={items.map((p) => p.name)} />}
      </Case>

      <Case label="items.length > 0 && …">
        {items.length > 0 && <List names={items.map((p) => p.name)} />}
      </Case>

      <Case label="items.length ? … : …">
        {items.length ? (
          <List names={items.map((p) => p.name)} />
        ) : (
          <p className="text-[12px] text-muted">No one to show</p>
        )}
      </Case>
    </div>
  );
}

function Case({
  label,
  broken,
  note,
  children,
}: {
  label: string;
  broken?: boolean;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded border p-2.5 ${
        broken ? "border-accent-line bg-accent-soft" : "border-line"
      }`}
    >
      <p className="font-mono text-[10px] text-muted">{label}</p>
      <div className="mt-2 min-h-16 text-[13px] text-fg">{children}</div>
      {note && (
        <p className="mt-1 font-mono text-[10px] text-accent">↑ {note}</p>
      )}
    </div>
  );
}

function List({ names }: { names: string[] }) {
  return (
    <ul className="space-y-0.5">
      {names.map((name) => (
        <li key={name} className="text-[13px]">
          {name}
        </li>
      ))}
    </ul>
  );
}
