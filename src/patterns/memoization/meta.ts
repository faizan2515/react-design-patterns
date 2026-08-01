import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Memoization",
  category: "performance",
  tier: 1,
  blurb:
    "`memo`, `useMemo` and `useCallback` — what they actually buy, when they buy nothing, and what React Compiler does instead.",
  problem:
    "`memo` skips a re-render when props are shallow-equal. The catch is that inline functions and object literals produce new props every render, so a memoised child compares them, finds them different, and re-renders anyway — paying for the comparison and gaining nothing. That is why `memo` and `useCallback` travel together. React Compiler changes the picture, and in a way worth stating precisely: it does not make a child skip renders, it memoises the JSX a parent creates, so React receives an identical element and never descends into the child. The saving comes from above.",
  whenToUse: [
    "A genuinely expensive child that re-renders often with unchanged props — measure first.",
    "Values passed into dependency arrays, where an unstable identity restarts effects.",
    "Context values, where a new object per render wakes every consumer.",
  ],
  whenNotToUse: [
    "By default. Most components are cheap, and the comparison is not free.",
    "`memo` without stabilising the props you pass it — that is strictly slower than nothing.",
    "In a compiled codebase, where the compiler already handles it and hand-memoisation is noise.",
  ],
  related: ["state-colocation", "transitions", "context-splitting"],
  docs: [
    {
      label: "react.dev — memo",
      href: "https://react.dev/reference/react/memo",
    },
    {
      label: "react.dev — React Compiler",
      href: "https://react.dev/learn/react-compiler",
    },
  ],
};

export default meta;
