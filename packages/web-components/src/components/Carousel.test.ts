import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../define';

const SLIDES_3 = JSON.stringify(['<p>1</p>', '<p>2</p>', '<p>3</p>']);
const SLIDES_2 = JSON.stringify(['<p>1</p>', '<p>2</p>']);

function slidesOf(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>('.lily-carousel__slide'));
}

function visibleIndex(el: HTMLElement): number {
  return slidesOf(el).findIndex((s) => !s.hasAttribute('aria-hidden'));
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-carousel timer lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not start the auto-advance interval while disconnected', () => {
    const el = document.createElement('lily-carousel');
    // Attribute changes before connection must not start a timer.
    el.setAttribute('slides', SLIDES_2);
    el.setAttribute('interval', '1000');
    expect(vi.getTimerCount()).toBe(0);

    document.body.appendChild(el);
    expect(vi.getTimerCount()).toBe(1);

    el.remove();
    expect(vi.getTimerCount()).toBe(0);

    // Nor must attribute changes after removal.
    el.setAttribute('interval', '500');
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('lily-carousel index clamping', () => {
  it('clamps an out-of-range controlled index into [0, count - 1]', () => {
    const el = document.createElement('lily-carousel');
    el.setAttribute('slides', SLIDES_2);
    el.setAttribute('index', '5');
    document.body.appendChild(el);
    expect(visibleIndex(el)).toBe(1);

    el.setAttribute('index', '-3');
    expect(visibleIndex(el)).toBe(0);
  });

  it('clamps the active slide when the slides array shrinks', () => {
    const el = document.createElement('lily-carousel');
    el.setAttribute('slides', SLIDES_3);
    document.body.appendChild(el);

    // Move to the last slide, then drop it.
    el.querySelectorAll<HTMLButtonElement>('.lily-carousel__indicator')[2]!.click();
    expect(visibleIndex(el)).toBe(2);

    el.setAttribute('slides', SLIDES_2);
    expect(slidesOf(el)).toHaveLength(2);
    expect(visibleIndex(el)).toBe(1);
  });
});
