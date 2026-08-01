import { useState } from "react";
import { ApiRoster } from "./ApiRoster";
import { MemoryRoster } from "./MemoryRoster";

type Source = "api" | "memory";

export default function Demo() {
  const [source, setSource] = useState<Source>("api");
  const [shouldFail, setShouldFail] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-md border border-line p-0.5">
          {(["api", "memory"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSource(option)}
              className={`rounded px-3 py-1 font-mono text-[11px] transition-colors ${
                source === option
                  ? "bg-accent-soft text-fg"
                  : "text-muted hover:text-fg"
              }`}
            >
              {option === "api" ? "From API" : "From memory"}
            </button>
          ))}
        </div>

        {source === "api" && (
          <label className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <input
              type="checkbox"
              checked={shouldFail}
              onChange={(event) => setShouldFail(event.target.checked)}
            />
            make the request fail
          </label>
        )}
      </div>

      {source === "api" ? <ApiRoster shouldFail={shouldFail} /> : <MemoryRoster />}

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Swap the source and watch the roster itself stay identical. Two containers with
        completely different data concerns drive one presentational component that knows
        about neither.
      </p>
    </div>
  );
}
