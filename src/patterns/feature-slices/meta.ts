import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Feature Slices",
  category: "architecture",
  tier: 2,
  blurb:
    "Group files by what they are for, not what they are — because changes follow features, not file types.",
  problem:
    "`components/`, `hooks/`, `types/` and `api/` look tidy and scatter every real change across four folders. Grouping by feature puts everything one change needs in one place, so the folder you open is the folder you edit. It also makes deletion possible: removing a feature becomes removing a directory rather than hunting its pieces through shared folders.",
  whenToUse: [
    "Any codebase past a handful of screens, especially with several people in it.",
    "Where features are genuinely separable — checkout, profile, search.",
    "When you keep scrolling past unrelated files to find the four you need.",
  ],
  whenNotToUse: [
    "Small apps, where one flat folder is genuinely easier to hold in your head.",
    "Truly shared primitives — those belong in a `ui/` or `lib/` layer outside the features.",
    "Without the import rule. Once features import each other directly, the slices are decorative.",
  ],
  related: ["atomic-design", "repository", "testing-seams"],
  docs: [
    {
      label: "react.dev — Thinking in React",
      href: "https://react.dev/learn/thinking-in-react",
    },
  ],
};

export default meta;
