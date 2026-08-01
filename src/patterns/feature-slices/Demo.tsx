import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { BY_FEATURE, BY_TYPE } from "./trees";

export default function Demo() {
  const [highlight, setHighlight] = useState(true);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="highlight files touched by one change"
          checked={highlight}
          onChange={setHighlight}
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <Tree title="Folder by type" files={BY_TYPE} highlight={highlight} />
        <Tree title="Folder by feature" files={BY_FEATURE} highlight={highlight} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The same twelve files, organised two ways. Highlighted are the ones a single change
        touches — “add a coupon field to checkout”. Grouped by type they are scattered
        across four folders; grouped by feature they sit together, and the folders that
        matter are the ones you already have open.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        This is the argument in one picture: changes follow features, not file types.
        Grouping by type optimises for “show me all the hooks”, which is a question nobody
        asks. Grouping by feature optimises for “change checkout”, which is every ticket.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Note <code className="text-fg">ui/</code> stays separate on the right. Genuinely
        shared, product-agnostic components do not belong to a feature — and the discipline
        that keeps this working is that features may import from{" "}
        <code className="text-fg">ui/</code> but not from each other. Once two features
        import each other directly, the slices have stopped meaning anything.
      </p>
    </div>
  );
}

function Tree({
  title,
  files,
  highlight,
}: {
  title: string;
  files: { path: string; touched: boolean }[];
  highlight: boolean;
}) {
  const touchedCount = files.filter((file) => file.touched).length;

  return (
    <div className="space-y-2 rounded-md border border-line p-3">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] text-fg">{title}</p>
        {highlight && (
          <p className="font-mono text-[10px] text-accent">
            {touchedCount} files, {new Set(files.filter((f) => f.touched).map((f) => f.path.split("/").slice(0, -1).join("/"))).size} folders
          </p>
        )}
      </div>

      <ul className="space-y-0.5">
        {files.map((file) => (
          <li
            key={file.path}
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
              highlight && file.touched
                ? "bg-accent-soft text-fg"
                : "text-muted"
            }`}
          >
            {file.path}
          </li>
        ))}
      </ul>
    </div>
  );
}
