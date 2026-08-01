import { Suspense } from "react";
import { Link, useParams } from "react-router";
import { CATEGORY_BY_ID } from "../registry/categories";
import { PATTERN_BY_SLUG, relatedPatterns } from "../registry/patterns";
import { TIER_LABEL } from "../registry/tiers";
import { CodeTabs } from "./CodeTabs";
import { DemoStage } from "./DemoStage";
import { NotFound } from "./NotFound";
import { TierMeter } from "./TierMeter";

export function PatternPage() {
  const { slug } = useParams();
  const pattern = slug ? PATTERN_BY_SLUG.get(slug) : undefined;

  if (!pattern) return <NotFound />;

  const { meta } = pattern;
  const category = CATEGORY_BY_ID.get(meta.category);
  const related = relatedPatterns(pattern);

  return (
    <article className="mx-auto max-w-215 px-6 py-10 sm:px-10 sm:py-14">
      <header>
        <div className="u-label flex items-center gap-2 text-[10px] text-muted">
          <span>{category?.label}</span>
          <span aria-hidden="true">·</span>
          <TierMeter tier={meta.tier} />
          <span>{TIER_LABEL[meta.tier]}</span>
        </div>

        <h1 className="u-display mt-5 text-[28px] leading-[1.15] text-fg sm:text-[36px]">
          {meta.title}
        </h1>

        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {meta.blurb}
        </p>
      </header>

      <div className="mt-10">
        <DemoStage Demo={pattern.Demo} />
      </div>

      <section className="mt-12">
        <SectionLabel>The problem</SectionLabel>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          {meta.problem}
        </p>
      </section>

      <section className="mt-10">
        <SectionLabel>Source</SectionLabel>
        <div className="mt-3">
          <Suspense
            fallback={
              <p className="rounded-lg border border-line bg-code px-4 py-6 font-mono text-[12px] text-muted">
                Loading source…
              </p>
            }
          >
            <CodeTabs slug={pattern.slug} />
          </Suspense>
        </div>
      </section>

      <section className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <SectionLabel>Reach for it when</SectionLabel>
          <ul className="mt-3 space-y-2">
            {meta.whenToUse.map((item) => (
              <li
                key={item}
                className="border-l-2 border-accent-line pl-3 text-[14px] leading-relaxed text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionLabel>Skip it when</SectionLabel>
          <ul className="mt-3 space-y-2">
            {meta.whenNotToUse.map((item) => (
              <li
                key={item}
                className="border-l-2 border-line pl-3 text-[14px] leading-relaxed text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <SectionLabel>Related</SectionLabel>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/${item.meta.category}/${item.slug}`}
                  className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-accent-line hover:text-fg"
                >
                  <TierMeter tier={item.meta.tier} />
                  {item.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {meta.docs && meta.docs.length > 0 && (
        <section className="mt-12 border-t border-line pt-6">
          <SectionLabel>Further reading</SectionLabel>
          <ul className="mt-3 space-y-1.5">
            {meta.docs.map((doc) => (
              <li key={doc.href}>
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[12.5px] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                >
                  {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="u-label text-[10px] text-muted">{children}</h2>
  );
}
