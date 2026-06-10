import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/vue';
import Countdown from './Countdown.vue';

describe('Countdown', () => {
  it('renders all-zero segments for an unparseable `to` instead of throwing', () => {
    const { container } = render(Countdown, {
      props: { to: 'not-a-datetime', live: false },
    });
    const values = Array.from(container.querySelectorAll('.lily-countdown__value')).map(
      (el) => el.textContent,
    );
    // dhms format → d / h / m / s, all zero (same as the web-components port).
    expect(values).toEqual(['00', '00', '00', '00']);
  });
});

describe('Countdown live toggling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts the per-second timer when `live` turns on after mount', async () => {
    // A target in the past: the first tick computes all zeros and emits `complete`,
    // which makes the (re)started timer observable without faking the clock.
    const to = '2000-01-01T00:00:00';
    const { emitted, rerender } = render(Countdown, { props: { to, live: false } });

    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(5000);
    expect(emitted('complete') ?? []).toHaveLength(0);

    await rerender({ to, live: true });
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(emitted('complete')).toHaveLength(1);
  });

  it('stops the timer when `live` turns off after mount', async () => {
    const to = '2099-01-01T00:00:00';
    const { rerender } = render(Countdown, { props: { to, live: true } });

    expect(vi.getTimerCount()).toBe(1);
    await rerender({ to, live: false });
    expect(vi.getTimerCount()).toBe(0);
  });
});
