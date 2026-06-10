import { afterEach, describe, expect, it, vi } from 'vitest';
import '../define';

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-back-top without matchMedia', () => {
  it('clicking scrolls instantly instead of throwing', () => {
    const originalMatchMedia = window.matchMedia;
    const originalScrollTo = window.scrollTo;
    const scrollTo = vi.fn();
    // Simulate a minimal runtime (SSR-like / bare jsdom) with no matchMedia.
    Object.defineProperty(window, 'matchMedia', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(window, 'scrollTo', {
      value: scrollTo,
      configurable: true,
      writable: true,
    });

    try {
      const el = document.createElement('lily-back-top');
      document.body.appendChild(el);
      const btn = el.querySelector<HTMLButtonElement>('button.lily-back-top');
      expect(btn).not.toBeNull();

      expect(() => btn!.click()).not.toThrow();
      // No reduced-motion signal available → never assume smooth motion.
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        value: originalMatchMedia,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(window, 'scrollTo', {
        value: originalScrollTo,
        configurable: true,
        writable: true,
      });
    }
  });
});
