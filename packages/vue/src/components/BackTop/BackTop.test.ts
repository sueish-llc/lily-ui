import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import BackTop from './BackTop.vue';

describe('BackTop', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('scrolls to top on click without crashing when matchMedia is unavailable', async () => {
    // Reproduce a minimal runtime without `matchMedia` (jsdom omits it too).
    vi.stubGlobal('matchMedia', undefined);
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    expect(window.matchMedia).toBeUndefined();

    // `visibilityHeight: -1` makes the button visible at scrollY = 0 (the
    // visibility update lands on the tick after mount).
    render(BackTop, { props: { visibilityHeight: -1 } });
    await nextTick();
    await fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));

    // No reduced-motion signal available → defaults to smooth scrolling.
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
