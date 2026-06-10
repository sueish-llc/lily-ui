import { useEffect } from 'react';

/**
 * Prevent body scroll while `active` (e.g. when a Modal/Offcanvas is open).
 * Restores the previous overflow on cleanup and compensates for the scrollbar
 * width to avoid layout shift.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
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
  }, [active]);
}
