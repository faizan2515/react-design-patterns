import type { ComponentType, LazyExoticComponent } from "react";

export type CategoryId =
  | "composition"
  | "rendering"
  | "state"
  | "data"
  | "performance"
  | "classic"
  | "architecture"
  | "anti-patterns";

/** 1 = core, everyone needs it. 2 = commonly reached for. 3 = advanced or situational. */
export type Tier = 1 | 2 | 3;

export interface DocLink {
  label: string;
  href: string;
}

/**
 * Authored in each pattern's `meta.ts`. The slug is NOT declared here — it is derived from
 * the folder name so the URL and the directory can never drift apart.
 */
export interface PatternMeta {
  title: string;
  category: CategoryId;
  tier: Tier;
  /** One sentence, shown in the sidebar and on cards. */
  blurb: string;
  /** The problem this pattern exists to solve. */
  problem: string;
  whenToUse: string[];
  whenNotToUse: string[];
  /** Slugs of related patterns, cross-linked at the bottom of the page. */
  related?: string[];
  docs?: DocLink[];
}

export interface SourceFile {
  name: string;
  /** Plain text, used by the copy button. */
  code: string;
  /** Syntax-highlighted markup, produced at build time by the `?highlight` plugin. */
  html: string;
}

export interface Pattern {
  slug: string;
  meta: PatternMeta;
  Demo: LazyExoticComponent<ComponentType>;
}

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
}
