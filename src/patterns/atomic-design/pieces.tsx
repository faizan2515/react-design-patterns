import type { ReactNode } from "react";

/*
  Atoms: no application knowledge, no layout opinions, no data fetching. They are the
  smallest things worth naming, and their test is whether they could move to another
  product unchanged.
*/
export function Label({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[10px] text-muted">{children}</span>;
}

export function Input({ placeholder }: { placeholder: string }) {
  return (
    <input
      placeholder={placeholder}
      className="w-full rounded border border-line bg-surface-2 px-2 py-1 font-mono text-[12px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
    />
  );
}

export function Button({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-fg transition-colors hover:border-accent-line"
    >
      {children}
    </button>
  );
}

/*
  Molecules: a few atoms doing one job together. Still no data, but now with a purpose —
  "a labelled field", not "an input".
*/
export function Field({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
    </div>
  );
}

export function SearchBar() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Field label="Search" placeholder="name or email…" />
      </div>
      <Button>Go</Button>
    </div>
  );
}

/*
  Organisms: a recognisable section of the interface. This is where application meaning
  arrives — and, in practice, where the tidy hierarchy starts to fray, because real
  sections rarely decompose as cleanly as the diagram suggests.
*/
export function MemberPanel() {
  return (
    <div className="space-y-3 rounded-md border border-line p-3">
      <SearchBar />
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Name" placeholder="Ada Lovelace" />
        <Field label="Team" placeholder="Platform" />
      </div>
      <div className="flex justify-end gap-2">
        <Button>Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}
