import type { ReactNode } from "react";

/**
 * Named regions passed as props.
 *
 * The signature is the documentation: anyone reading `PropSlotCard` can see there are
 * exactly three regions and what happens when one is omitted. TypeScript enforces it,
 * and there is no context, no cloning, and no runtime inspection of children.
 *
 * The limit is arity — a fourth region means a fourth prop, and regions cannot repeat.
 */
export function PropSlotCard({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="border-b border-line bg-surface-2 px-3 py-2">{header}</div>
      <div className="px-3 py-3 text-[13px] text-muted">{children}</div>
      {footer && (
        <div className="border-t border-line bg-surface-2 px-3 py-2">{footer}</div>
      )}
    </div>
  );
}

/**
 * The same three regions expressed as children.
 *
 * Reads more like markup and scales to any number of regions, at the cost of the compiler
 * no longer knowing a header exists. Note there is no context here and no `React.Children`
 * inspection — each part simply renders its own chrome, which is the version worth
 * copying. Reordering the parts reorders the card, for better or worse.
 */
export function SlotCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-line">{children}</div>
  );
}

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-line bg-surface-2 px-3 py-2">{children}</div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <div className="px-3 py-3 text-[13px] text-muted">{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-line bg-surface-2 px-3 py-2">{children}</div>
  );
}

SlotCard.Header = Header;
SlotCard.Body = Body;
SlotCard.Footer = Footer;
