import { watch, onScopeDispose, type Ref } from 'vue';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Prevent body scroll while `active` is true (e.g. when a Modal/Offcanvas is
 * open). Restores the previous overflow and compensates for the scrollbar width
 * to avoid layout shift.
 */
export function useScrollLock(active: Ref<boolean>): void {
  let restore: (() => void) | null = null;

  const lock = () => {
    if (restore || typeof document === 'undefined') return;
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    restore = () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  };

  const unlock = () => {
    restore?.();
    restore = null;
  };

  watch(active, (v) => (v ? lock() : unlock()), { immediate: true });
  onScopeDispose(unlock);
}

/**
 * Trap keyboard focus within `el` while `active`. On activation, focus moves
 * into the container; on deactivation, focus returns to the previously focused
 * element. Tab/Shift+Tab cycle within (WAI-ARIA dialog pattern).
 */
export function useFocusTrap(el: Ref<HTMLElement | null>, active: Ref<boolean>): void {
  let cleanup: (() => void) | null = null;

  const activate = () => {
    const node = el.value;
    if (!node) return;
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
    cleanup = () => {
      node.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  };

  const deactivate = () => {
    cleanup?.();
    cleanup = null;
  };

  watch(
    active,
    (v) => {
      deactivate();
      if (v) {
        // Wait for the element to be rendered before trapping.
        requestAnimationFrame(() => active.value && activate());
      }
    },
    { immediate: true },
  );
  onScopeDispose(deactivate);
}

export interface DismissOptions {
  escape?: boolean;
  outsideClick?: boolean;
}

/**
 * Call `onDismiss` when the user presses Escape or clicks/taps outside `el`,
 * while `active`. Used by overlays (Dropdown, Popover, Modal, Offcanvas…).
 */
export function useDismiss(
  el: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onDismiss: () => void,
  options: DismissOptions = {},
): void {
  const { escape = true, outsideClick = true } = options;
  let cleanup: (() => void) | null = null;

  const activate = () => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (escape && e.key === 'Escape') onDismiss();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!outsideClick) return;
      const node = el.value;
      if (node && !node.contains(e.target as Node)) onDismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    cleanup = () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  };

  const deactivate = () => {
    cleanup?.();
    cleanup = null;
  };

  watch(active, (v) => (v ? activate() : deactivate()), { immediate: true });
  onScopeDispose(deactivate);
}
