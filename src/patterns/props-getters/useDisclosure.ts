import { useCallback, useId, useState } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent } from "react";

/**
 * Composes the caller's handler with the component's own, in that order, and lets the
 * caller opt out by calling `preventDefault()`.
 *
 * Running the caller first is the important half: it gives them a chance to cancel. Naming
 * it `callAll` and scattering it inline is the usual mistake — this belongs in one place
 * so every getter behaves the same way.
 */
function compose<E extends { defaultPrevented: boolean }>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours(event);
  };
}

/**
 * Props getters: instead of returning loose values for the caller to wire up, return
 * functions that produce a complete set of props for each element.
 *
 * The caller writes `<button {...getButtonProps()}>` and gets the click handler, the ARIA
 * wiring and the ids for free — and can still pass their own props through the getter,
 * which merges rather than clobbers. Compare with compound components, where the parent
 * supplies the elements too; here the caller owns every element and only borrows the
 * behaviour.
 */
export function useDisclosure(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  const getButtonProps = useCallback(
    (
      props: ButtonHTMLAttributes<HTMLButtonElement> = {},
    ): ButtonHTMLAttributes<HTMLButtonElement> => ({
      ...props,
      id: buttonId,
      type: "button",
      "aria-expanded": open,
      "aria-controls": panelId,
      onClick: compose<MouseEvent<HTMLButtonElement>>(props.onClick, () =>
        setOpen((current) => !current),
      ),
    }),
    [open, panelId, buttonId],
  );

  const getPanelProps = useCallback(
    (props: HTMLAttributes<HTMLDivElement> = {}): HTMLAttributes<HTMLDivElement> => ({
      ...props,
      id: panelId,
      role: "region",
      "aria-labelledby": buttonId,
      hidden: !open,
    }),
    [open, panelId, buttonId],
  );

  return { open, getButtonProps, getPanelProps };
}
