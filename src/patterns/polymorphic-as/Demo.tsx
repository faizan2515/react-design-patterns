import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Text } from "./Text";

const AS = [
  { value: "span", label: "span" },
  { value: "a", label: "a" },
  { value: "button", label: "button" },
  { value: "h3", label: "h3" },
] as const;

type As = (typeof AS)[number]["value"];

export default function Demo() {
  const [as, setAs] = useState<As>("span");
  const [clicks, setClicks] = useState(0);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice label="Rendered as" value={as} onChange={setAs} options={AS} />
        <Knobs.Readout label="clicks">{clicks}</Knobs.Readout>
      </Knobs>

      <div className="rounded-md border border-line p-4">
        {/*
          Each branch is written out rather than passing `as={as}` from a variable,
          because that is what shows the typing doing its job: `href` only compiles in
          the anchor branch, `onClick`/`disabled` only in the button branch.
        */}
        {as === "span" && <Text tone="muted">A plain span, styled and inert.</Text>}

        {as === "a" && (
          <Text
            as="a"
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            tone="accent"
            className="underline underline-offset-4"
          >
            An anchor — href is accepted here and nowhere else
          </Text>
        )}

        {as === "button" && (
          <Text
            as="button"
            onClick={() => setClicks((n) => n + 1)}
            className="rounded border border-line px-3 py-1.5"
          >
            A real button — focusable, and Enter works
          </Text>
        )}

        {as === "h3" && (
          <Text as="h3" className="text-[20px]">
            A heading the screen reader announces as one
          </Text>
        )}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Same component, same styling props, four different elements. Tab through each one:
        only the button and the link are reachable from the keyboard, because they are
        genuinely those elements rather than a <code className="text-fg">span</code> with a
        click handler bolted on.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The typing is the point. Try adding <code className="text-fg">href</code> to the
        button branch in your editor — it will not compile, because{" "}
        <code className="text-fg">as</code> narrows the accepted props to that element's
        own.
      </p>
    </div>
  );
}
