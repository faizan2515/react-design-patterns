import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/*
  `className` is declared here rather than inherited from the element, and that is not
  incidental. Left to the generic it resolves to `ComponentProps<E>["className"]`, which
  TypeScript cannot prove is a string for an unresolved `E` — so merging our styles into
  it fails to compile. Owning the prop makes it concretely a string, and the `Omit` below
  keeps the element's version from colliding.
*/
type TextOwnProps = {
  tone?: "default" | "muted" | "accent";
  className?: string;
  children?: ReactNode;
};

/**
 * The generic that makes it work: `E` is whatever was passed as `as`, so the accepted
 * props become that element's props. `as="a"` accepts `href`; `as="button"` accepts
 * `disabled` and rejects `href`, all checked at compile time.
 *
 * `Omit` prevents the element's own props from colliding with ours — without it, an
 * element that happens to have a `tone` attribute would fight with the styling prop.
 */
type TextProps<E extends ElementType> = TextOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps | "as">;

const TONE = {
  default: "text-fg",
  muted: "text-muted",
  accent: "text-accent",
} as const;

/**
 * One component, any element.
 *
 * The alternative is a component per tag, or a `variant` prop that maps to tags and never
 * quite covers the case you need. This keeps the styling in one place while letting the
 * caller choose the element the accessibility tree actually sees — which matters, because
 * a `div` with an onClick is not a button no matter how it looks.
 */
export function Text<E extends ElementType = "span">({
  as,
  tone = "default",
  className = "",
  children,
  ...rest
}: TextProps<E>) {
  const Component = (as ?? "span") as ElementType;

  return (
    <Component className={`${TONE[tone]} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}
