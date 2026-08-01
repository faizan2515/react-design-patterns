import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { TabsContext, useTabs } from "./tabsContext";

/**
 * Compound components: several components that only make sense together, sharing state
 * implicitly through context instead of through props.
 *
 * The alternative API is a config prop — `<Tabs items={[{ label, content }]} />`. That
 * version owns your markup: every new requirement (an icon, a badge, a divider, a
 * disabled tab) becomes another prop on Tabs. Here the caller writes the markup and Tabs
 * only supplies behaviour, so those requirements need no API change at all.
 */
export function Tabs({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(defaultTab);

  const value = useMemo(
    () => ({ active, select: setActive }),
    [active],
  );

  return <TabsContext value={value}>{children}</TabsContext>;
}

function List({ children }: { children: ReactNode }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-line">
      {children}
    </div>
  );
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, select } = useTabs();
  const selected = active === id;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => select(id)}
      className={`-mb-px border-b-2 px-3 py-1.5 font-mono text-[12px] transition-colors ${
        selected
          ? "border-accent text-fg"
          : "border-transparent text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  if (active !== id) return null;

  return (
    <div role="tabpanel" className="pt-3 text-sm text-muted">
      {children}
    </div>
  );
}

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;
