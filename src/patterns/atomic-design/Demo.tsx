import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Button, Field, Input, Label, MemberPanel, SearchBar } from "./pieces";

const LEVELS = [
  { value: "atoms", label: "Atoms" },
  { value: "molecules", label: "Molecules" },
  { value: "organisms", label: "Organisms" },
] as const;

type Level = (typeof LEVELS)[number]["value"];

export default function Demo() {
  const [level, setLevel] = useState<Level>("atoms");

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice label="Level" value={level} onChange={setLevel} options={LEVELS} />
      </Knobs>

      <div className="rounded-md border border-line p-4">
        {level === "atoms" && (
          <div className="space-y-3">
            <Label>a label</Label>
            <Input placeholder="an input" />
            <Button>a button</Button>
          </div>
        )}

        {level === "molecules" && (
          <div className="space-y-4">
            <Field label="Email" placeholder="ada@example.com" />
            <SearchBar />
          </div>
        )}

        {level === "organisms" && <MemberPanel />}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Same building blocks at three scales. Atoms know nothing about the product;
        molecules combine a few of them for one job; organisms are a section of interface
        with application meaning. The value is the direction of dependency — atoms never
        import organisms, so the bottom of the stack stays reusable.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The honest caveat is that the vocabulary is where most teams argue. Is a search bar
        a molecule or an organism? Nobody agrees, and the debate produces nothing. What
        survives from Atomic Design in practice is the useful half: keep primitives free of
        application knowledge, and let dependencies point one way. The Greek nouns are
        optional.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Many teams get the same benefit from two folders — <code className="text-fg">ui/</code>{" "}
        for anything product-agnostic and <code className="text-fg">features/</code> for
        everything else — with no taxonomy to police.
      </p>
    </div>
  );
}
