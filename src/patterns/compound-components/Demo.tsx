import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Tabs } from "./Tabs";

export default function Demo() {
  const [badge, setBadge] = useState(true);
  const [reversed, setReversed] = useState(false);

  const tabs = [
    <Tabs.Tab key="overview" id="overview">
      Overview
    </Tabs.Tab>,
    <Tabs.Tab key="activity" id="activity">
      Activity
      {badge && (
        <span className="ml-1.5 rounded bg-accent-soft px-1 text-[10px] text-accent">
          3
        </span>
      )}
    </Tabs.Tab>,
    <Tabs.Tab key="settings" id="settings">
      Settings
    </Tabs.Tab>,
  ];

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="badge on Activity" checked={badge} onChange={setBadge} />
        <Knobs.Toggle label="reverse tab order" checked={reversed} onChange={setReversed} />
      </Knobs>

      <Tabs defaultTab="overview">
        <Tabs.List>{reversed ? [...tabs].reverse() : tabs}</Tabs.List>

        <Tabs.Panel id="overview">
          Tabs supplies behaviour. The markup inside it is yours.
        </Tabs.Panel>
        <Tabs.Panel id="activity">
          The badge above needed no change to the Tabs API — it is just a child.
        </Tabs.Panel>
        <Tabs.Panel id="settings">
          Panels can be declared in any order, or nested inside other elements.
        </Tabs.Panel>
      </Tabs>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Add the badge and reorder the tabs. Neither required a prop on{" "}
        <code className="text-fg">Tabs</code>, because Tabs never owned that markup. A
        config-prop API — <code className="text-fg">{"<Tabs items={…} />"}</code> — would
        have needed a new prop for each of these, and one for everything after them.
      </p>
    </div>
  );
}
