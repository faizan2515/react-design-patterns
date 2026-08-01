import { useActionState, useState } from "react";
import { fakeRequest } from "../../lab/fakeApi";
import { Knobs } from "../../lab/Knobs";
import { SubmitButton } from "./SubmitButton";

interface FormResult {
  status: "idle" | "saved" | "error";
  message: string;
  /** Echoed back so the field is not cleared when submission fails. */
  values: { name: string; email: string };
}

const EMPTY: FormResult = {
  status: "idle",
  message: "",
  values: { name: "", email: "" },
};

export default function Demo() {
  const [failing, setFailing] = useState(false);

  /*
    `useActionState` takes an async function and gives back its latest result plus a
    pending flag, and hands the action straight to `<form action={…}>`.

    What that removes is the boilerplate every form used to carry: an isSubmitting
    boolean, a result state, a try/catch, and an onSubmit that starts with
    preventDefault(). What it adds is that the form works with FormData, so the fields do
    not need to be controlled at all.
  */
  const [result, submit, pending] = useActionState(
    async (_previous: FormResult, formData: FormData): Promise<FormResult> => {
      const values = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
      };

      if (!values.name.trim()) {
        return { status: "error", message: "Name is required.", values };
      }

      try {
        await fakeRequest(values, { latency: 1200, fail: failing });
        return { status: "saved", message: `Saved ${values.name}.`, values };
      } catch {
        return {
          status: "error",
          message: "The server rejected that. Try again.",
          values,
        };
      }
    },
    EMPTY,
  );

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="server rejects the save"
          checked={failing}
          onChange={setFailing}
        />
        <Knobs.Readout label="pending">{String(pending)}</Knobs.Readout>
      </Knobs>

      <form action={submit} className="space-y-3 rounded-md border border-line p-4">
        <Field
          name="name"
          label="Name"
          defaultValue={result.values.name}
          placeholder="Ada Lovelace"
        />
        <Field
          name="email"
          label="Email"
          defaultValue={result.values.email}
          placeholder="ada@example.com"
        />

        <div className="flex items-center gap-3">
          <SubmitButton label="Save profile" />

          {result.status !== "idle" && (
            <span
              className={`font-mono text-[11px] ${
                result.status === "error" ? "text-accent" : "text-muted"
              }`}
            >
              {result.message}
            </span>
          )}
        </div>
      </form>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Submit with the name empty, or with the server rejecting. The values come back in
        the action's result and are fed to <code className="text-fg">defaultValue</code>,
        so a failed submit does not wipe what was typed — the single most common way
        hand-rolled forms annoy people.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        There is no <code className="text-fg">isSubmitting</code> state, no{" "}
        <code className="text-fg">preventDefault</code>, and the inputs are uncontrolled —
        the action receives <code className="text-fg">FormData</code>. The submit button
        knows it is pending because <code className="text-fg">useFormStatus</code> reads
        the form above it, which only works from a component *inside* the form. Call it
        beside the <code className="text-fg">&lt;form&gt;</code> and it always reports
        idle.
      </p>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="font-mono text-[11px] text-muted">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[12px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
      />
    </label>
  );
}
