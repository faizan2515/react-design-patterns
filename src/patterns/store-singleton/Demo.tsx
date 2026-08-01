import { Knobs } from "../../lab/Knobs";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import { counterStore, increment, rename } from "./counterStore";
import { useStore } from "./createStore";

const NAMES = ["Ada", "Grace", "Alan"];

export default function Demo() {
  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action label="count + 1" onClick={increment} />
        {NAMES.map((name) => (
          <Knobs.Action
            key={name}
            label={`name = ${name}`}
            onClick={() => rename(name)}
          />
        ))}
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-3">
        <CountReader />
        <NameReader />
        <WholeStateReader />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Three components, no provider, no props — they import the store directly. Press{" "}
        <code className="text-fg">count + 1</code> and only the two that read{" "}
        <code className="text-fg">count</code> re-render. Change the name and the count
        reader stays untouched. This is the precision a context cannot give you: a context
        wakes every consumer, a selector wakes the ones that care.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The third card selects the whole state object and re-renders on every change, even
        ones it does not display. That is not a flaw in the store — a new object is never{" "}
        <code className="text-fg">Object.is</code>-equal to the previous one, so the
        selector reports a change every time. Selecting objects is how people accidentally
        turn a precise store back into a blunt one.
      </p>
    </div>
  );
}

function CountReader() {
  const count = useStore(counterStore, (state) => state.count);
  const renders = useRenderCount();

  return (
    <Card title="selects count" renders={renders}>
      <span className="font-mono text-[22px] tabular-nums text-fg">{count}</span>
    </Card>
  );
}

function NameReader() {
  const name = useStore(counterStore, (state) => state.name);
  const renders = useRenderCount();

  return (
    <Card title="selects name" renders={renders}>
      <span className="font-mono text-[18px] text-fg">{name}</span>
    </Card>
  );
}

function WholeStateReader() {
  const state = useStore(counterStore, (s) => s);
  const renders = useRenderCount();

  return (
    <Card title="selects everything" renders={renders} warn>
      <span className="font-mono text-[12px] text-fg">
        {state.name} · {state.count}
      </span>
    </Card>
  );
}

function Card({
  title,
  renders,
  warn,
  children,
}: {
  title: string;
  renders: number;
  warn?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`space-y-2 rounded-md border p-3 ${
        warn ? "border-accent-line" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{title}</span>
        <RenderBadge count={renders} highlight={warn} />
      </div>
      {children}
    </div>
  );
}
