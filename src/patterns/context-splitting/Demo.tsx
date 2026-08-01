import { useMemo, useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import {
  EverythingContext,
  PrefsContext,
  SessionContext,
  ThemeContext,
  usePrefs,
  useSession,
  useTheme,
} from "./contexts";

const ACCENTS = ["violet", "amber", "teal"];
const USERS = ["Ada", "Grace"];
const DENSITIES = ["cosy", "compact"];

export default function Demo() {
  const [split, setSplit] = useState(true);
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [user, setUser] = useState(USERS[0]);
  const [density, setDensity] = useState(DENSITIES[0]);

  const theme = useMemo(() => ({ accent }), [accent]);
  const session = useMemo(() => ({ user }), [user]);
  const prefs = useMemo(() => ({ density }), [density]);
  const everything = useMemo(
    () => ({ accent, user, density }),
    [accent, user, density],
  );

  const readers = (
    <div className="grid gap-3 sm:grid-cols-3">
      <ThemeReader />
      <SessionReader />
      <PrefsReader />
    </div>
  );

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="split into three contexts"
          checked={split}
          onChange={setSplit}
        />
        <Knobs.Action
          label="cycle accent"
          onClick={() =>
            setAccent((a) => ACCENTS[(ACCENTS.indexOf(a) + 1) % ACCENTS.length])
          }
        />
        <Knobs.Action
          label="switch user"
          onClick={() => setUser((u) => (u === USERS[0] ? USERS[1] : USERS[0]))}
        />
        <Knobs.Action
          label="toggle density"
          onClick={() =>
            setDensity((d) => (d === DENSITIES[0] ? DENSITIES[1] : DENSITIES[0]))
          }
        />
      </Knobs>

      {/* Remounted on the toggle so each design starts counting from zero. */}
      <div key={String(split)}>
        {split ? (
          <ThemeContext value={theme}>
            <SessionContext value={session}>
              <PrefsContext value={prefs}>{readers}</PrefsContext>
            </SessionContext>
          </ThemeContext>
        ) : (
          <EverythingContext value={everything}>{readers}</EverythingContext>
        )}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Press “cycle accent” a few times. Split, only the theme reader re-renders.
        Combined, all three do — the context value is one object, so changing any field
        changes it for everyone.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Context has no selectors. Every consumer re-renders when the value changes,
        regardless of which part it actually reads, so the granularity of your contexts is
        the granularity of your re-renders. Splitting by concern is the only tuning
        available — and memoising the value is required either way, or a new object every
        render wakes everyone constantly.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        There is a limit to how far this goes. When you find yourself splitting a fourth
        and fifth time to dodge re-renders, the answer is a store with selectors, where a
        component subscribes to exactly the value it reads.
      </p>
    </div>
  );
}

function ThemeReader() {
  const { accent } = useTheme();
  const renders = useRenderCount();
  return <Card title="reads theme" value={accent} renders={renders} />;
}

function SessionReader() {
  const { user } = useSession();
  const renders = useRenderCount();
  return <Card title="reads session" value={user} renders={renders} />;
}

function PrefsReader() {
  const { density } = usePrefs();
  const renders = useRenderCount();
  return <Card title="reads prefs" value={density} renders={renders} />;
}

function Card({
  title,
  value,
  renders,
}: {
  title: string;
  value: string;
  renders: number;
}) {
  return (
    <div className="space-y-2 rounded-md border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{title}</span>
        <RenderBadge count={renders} />
      </div>
      <p className="font-mono text-[15px] text-fg">{value}</p>
    </div>
  );
}
