import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import {
  BOUNDARY_RULES,
  CLIENT_COMPONENT_HTML,
  SERVER_ACTION_HTML,
  SERVER_COMPONENT_HTML,
} from "./snippets";

const TABS = [
  { value: "server", label: "Server Component" },
  { value: "client", label: "Client Component" },
  { value: "action", label: "Server Action" },
] as const;

type Tab = (typeof TABS)[number]["value"];

/* Pre-highlighted at build time, exactly like the source panel below. */
const CODE: Record<Tab, string> = {
  server: SERVER_COMPONENT_HTML,
  client: CLIENT_COMPONENT_HTML,
  action: SERVER_ACTION_HTML,
};

export default function Demo() {
  const [tab, setTab] = useState<Tab>("server");

  return (
    <div className="space-y-4">
      {/* Said up front, because a demo that pretends to run would teach the wrong model. */}
      <div className="rounded-md border border-accent-line bg-accent-soft p-3">
        <p className="u-label text-[9.5px] text-accent">Not runnable here</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-fg">
          This site is a Vite single-page app with no server. Server Components need a
          bundler and runtime that can split one module graph across a network boundary, so
          this page shows real code and explains the model rather than faking it.
        </p>
      </div>

      <Knobs>
        <Knobs.Choice label="Show" value={tab} onChange={setTab} options={TABS} />
      </Knobs>

      {/* Build-time output from our own plugin, over files in this repo — safe to inject. */}
      <div
        className="rdp-code overflow-x-auto rounded-md border border-line bg-code p-4 text-[12px] leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: CODE[tab] }}
      />

      <div className="space-y-2">
        <p className="u-label text-[9.5px] text-muted">The rules that actually bite</p>
        {BOUNDARY_RULES.map((item) => (
          <div key={item.rule} className="rounded-md border border-line p-3">
            <p className="font-mono text-[12px] text-fg">{item.rule}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The shift is where components run. A Server Component executes once on the server,
        can await a database directly, and ships no JavaScript for itself — which removes
        the effect, the loading state and the API route that a client-only app needs to
        show the same list.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        What it does not remove is client state. Anything interactive still needs a client
        boundary, and the skill is placing those boundaries low in the tree. Most RSC
        performance problems are a <code className="text-fg">"use client"</code> too high
        up, quietly pulling half the app into the browser bundle.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Server Actions are the other half: a server function a form can call directly,
        using the same <code className="text-fg">{"<form action>"}</code> API as the
        Actions pattern in this catalog — which does run here, because that part of React
        19 needs no server.
      </p>
    </div>
  );
}
