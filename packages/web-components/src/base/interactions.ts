/**
 * Imperative interaction helpers shared by the overlay/disclosure custom
 * elements. Each returns a cleanup function.
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Prevent body scroll. Restores previous overflow and compensates for the
 * scrollbar width to avoid layout shift.
 */
export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => {};
  const { body, documentElement } = document;
  const prevOverflow = body.style.overflow;
  const prevPaddingRight = body.style.paddingRight;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
  return () => {
    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPaddingRight;
  };
}

/**
 * Trap keyboard focus within `node`. Moves focus inside on activation and
 * restores it to the previously focused element on cleanup.
 */
export function trapFocus(node: HTMLElement): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const getFocusable = () =>
    Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (e) => e.offsetParent !== null || e === document.activeElement,
    );

  (getFocusable()[0] ?? node).focus();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const items = getFocusable();
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
      e.preventDefault();
      return;
    }
    const activeEl = document.activeElement;
    if (e.shiftKey && activeEl === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  };

  node.addEventListener('keydown', onKeyDown);
  return () => {
    node.removeEventListener('keydown', onKeyDown);
    previouslyFocused?.focus?.();
  };
}

export interface DismissOptions {
  escape?: boolean;
  outsideClick?: boolean;
}

/**
 * Call `onDismiss` on Escape or click/tap outside `node`. Used by overlays
 * (Dropdown, Popover, Modal, Offcanvas…).
 */
export function listenDismiss(
  node: HTMLElement,
  onDismiss: () => void,
  options: DismissOptions = {},
): () => void {
  const { escape = true, outsideClick = true } = options;

  const onKeyDown = (e: KeyboardEvent) => {
    if (escape && e.key === 'Escape') onDismiss();
  };
  const onPointerDown = (e: PointerEvent) => {
    if (!outsideClick) return;
    if (!node.contains(e.target as Node)) onDismiss();
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('pointerdown', onPointerDown, true);
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('pointerdown', onPointerDown, true);
  };
}
