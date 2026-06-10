import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/vue';
import RelativeTime from './RelativeTime.vue';

const VALUE = '2000-01-01T00:00:00Z';

describe('RelativeTime live toggling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts and stops its interval when `live` is toggled after mount', async () => {
    const { rerender } = render(RelativeTime, { props: { value: VALUE, live: false } });
    expect(vi.getTimerCount()).toBe(0);

    await rerender({ value: VALUE, live: true });
    expect(vi.getTimerCount()).toBe(1);

    await rerender({ value: VALUE, live: false });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('re-creates the interval when `updateInterval` changes after mount', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const { rerender } = render(RelativeTime, {
      props: { value: VALUE, live: true, updateInterval: 30_000 },
    });
    expect(setIntervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 30_000);
    expect(vi.getTimerCount()).toBe(1);

    await rerender({ value: VALUE, live: true, updateInterval: 1000 });
    expect(setIntervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    // The old interval was cleared — exactly one remains.
    expect(vi.getTimerCount()).toBe(1);
  });

  it('clamps updateInterval to a minimum of 1000ms (no busy loop at 0)', () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    render(RelativeTime, { props: { value: VALUE, live: true, updateInterval: 0 } });
    expect(setIntervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
