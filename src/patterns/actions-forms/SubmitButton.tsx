import { useFormStatus } from "react-dom";

/**
 * `useFormStatus` reads the pending state of the nearest enclosing `<form>` — from a
 * child, without that state being passed down.
 *
 * The rule people trip on: it only works in a component *inside* the form. Called in the
 * component that renders the form, it reports nothing, because there is no enclosing form
 * from its own position in the tree. That constraint is the point — it lets a shared
 * submit button be pending-aware anywhere it is dropped, with no prop threading.
 */
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border border-line px-3 py-1.5 font-mono text-[12px] text-fg transition-colors hover:border-accent-line disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
