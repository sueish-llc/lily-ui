import { useEffect, type RefObject } from 'react';

/**
 * Call `onDismiss` when the user presses Escape or clicks/taps outside `ref`,
 * while `active`. Used by overlays (Dropdown, Popover, Modal, Offcanvas…).
 */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
  options: { escape?: boolean; outsideClick?: boolean } = {},
) {
  const { escape = true, outsideClick = true } = options;

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (escape && e.key === 'Escape') onDismiss();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!outsideClick) return;
      const node = ref.current;
      if (node && !node.contains(e.target as Node)) onDismiss();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [ref, active, onDismiss, escape, outsideClick]);
}
