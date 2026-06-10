import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../define';

describe('lily-relative-time timer lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('starts a single interval even when attributes are set before connection', () => {
    const el = document.createElement('lily-relative-time');
    // Mirrors parse-time upgrades: attributeChangedCallback fires (and used to
    // start a leaking interval) before connectedCallback starts its own.
    el.setAttribute('value', Temporal.Now.instant().subtract({ minutes: 3 }).toString());
    el.setAttribute('live', '');
    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('keeps a single interval across attribute changes and stops after removal', () => {
    const el = document.createElement('lily-relative-time');
    el.setAttribute('value', Temporal.Now.instant().subtract({ minutes: 3 }).toString());
    el.setAttribute('live', '');
    document.body.appendChild(el);
    el.setAttribute('update-interval', '1000');
    expect(vi.getTimerCount()).toBe(1);

    el.remove();
    expect(vi.getTimerCount()).toBe(0);
    expect(() => vi.advanceTimersByTime(5_000)).not.toThrow();
  });

  it('does not restart the timer from attribute changes while disconnected', () => {
    const el = document.createElement('lily-relative-time');
    el.setAttribute('value', Temporal.Now.instant().subtract({ minutes: 3 }).toString());
    el.setAttribute('live', '');
    document.body.appendChild(el);
    el.remove();
    expect(vi.getTimerCount()).toBe(0);

    el.setAttribute('update-interval', '5000');
    expect(vi.getTimerCount()).toBe(0);

    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('clamps update-interval to a 1s minimum (no setInterval busy loop)', () => {
    const spy = vi.spyOn(globalThis, 'setInterval');
    const el = document.createElement('lily-relative-time');
    el.setAttribute('value', Temporal.Now.instant().subtract({ minutes: 3 }).toString());
    el.setAttribute('live', '');
    el.setAttribute('update-interval', '0');
    document.body.appendChild(el);

    expect(spy).toHaveBeenCalled();
    for (const call of spy.mock.calls) {
      expect(call[1]).toBeGreaterThanOrEqual(1000);
    }
    spy.mockRestore();
  });
});
