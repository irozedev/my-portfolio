import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface Options {
  isOpen: boolean;
  onClose: () => void;
  /** Set false for modals that must not close on backdrop/Escape. */
  closeOnEscape?: boolean;
}

/**
 * Everything a dialog needs to be usable without a mouse. None of the five
 * modals in this app had any of it: no Escape, no focus trap, and focus stayed
 * on the page behind, so a keyboard user could tab straight out of an open
 * dialog into content that was visually covered.
 *
 * Returns a ref to spread onto the dialog element. Pair it with
 * `role="dialog"`, `aria-modal="true"` and `aria-labelledby`.
 */
export function useModalA11y({ isOpen, onClose, closeOnEscape = true }: Options) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember what had focus so we can hand it back on close
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    // Move focus into the dialog; fall back to the container itself
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialog) return;

      // Query on every Tab rather than once — dialog contents change as steps
      // advance or validation messages appear.
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      // Return focus to whatever opened the dialog
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose, closeOnEscape]);

  return dialogRef;
}
