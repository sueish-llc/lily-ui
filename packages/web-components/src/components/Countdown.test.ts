import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../define';

describe('lily-countdown timer lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('starts a single interval even when attributes are set before connection', () => {
    const el = document.createElement('lily-countdown');
    // Mirrors parse-time upgrades: attributeChangedCallback fires (and used to
    // start a leaking interval) before connectedCallback starts its own.
    el.setAttribute('to', Temporal.Now.instant().add({ hours: 1 }).toString());
    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('does not start a timer from attribute changes before connection', () => {
    const el = document.createElement('lily-countdown');
    el.setAttribute('to', Temporal.Now.instant().add({ hours: 1 }).toString());
    // Never connected: attributeChangedCallback alone must not start ticking.
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not restart the timer from attribute changes after removal', () => {
    const el = document.createElement('lily-countdown');
    el.setAttribute('to', Temporal.Now.instant().add({ hours: 1 }).toString());
    document.body.appendChild(el);
    el.remove();
    expect(vi.getTimerCount()).toBe(0);

    el.setAttribute('to', Temporal.Now.instant().add({ hours: 2 }).toString());
    expect(vi.getTimerCount()).toBe(0);

    // Reconnecting starts it again (connectedCallback owns the start).
    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('keeps a single interval across attribute changes and stops after removal', () => {
    const el = document.createElement('lily-countdown');
    el.setAttribute('to', Temporal.Now.instant().add({ hours: 1 }).toString());
    document.body.appendChild(el);
    el.setAttribute('to', Temporal.Now.instant().add({ hours: 2 }).toString());
    expect(vi.getTimerCount()).toBe(1);

    el.remove();
    expect(vi.getTimerCount()).toBe(0);
    // Advancing time after removal must not tick a leaked interval.
    expect(() => vi.advanceTimersByTime(5_000)).not.toThrow();
  });
});
