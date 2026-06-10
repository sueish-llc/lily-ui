import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../define';

// Deterministic requestAnimationFrame so the drag's frame batching can be
// driven explicitly (jsdom's own rAF timing is not controllable).
let rafCallbacks: Map<number, FrameRequestCallback>;
let rafId: number;

function flushFrames(): void {
  const cbs = [...rafCallbacks.values()];
  rafCallbacks.clear();
  for (const cb of cbs) cb(0);
}

function mount(attrs: Record<string, string> = {}): {
  el: HTMLElement;
  root: HTMLElement;
  handle: HTMLElement;
} {
  const el = document.createElement('lily-splitter');
  el.append(document.createElement('div'), document.createElement('div'));
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  const root = el.querySelector<HTMLElement>('.lily-splitter')!;
  // jsdom has no layout: give the container a fixed 200×100 box.
  root.getBoundingClientRect = () =>
    ({ left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  return { el, root, handle: el.querySelector<HTMLElement>('.lily-splitter__handle')! };
}

beforeEach(() => {
  rafCallbacks = new Map();
  rafId = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafCallbacks.set(++rafId, cb);
    return rafId;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    rafCallbacks.delete(id);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('lily-splitter markup', () => {
  it('renders the handle exactly like the React source of truth', () => {
    const { handle } = mount({ size: '40', min: '20', max: '80', 'handle-label': 'Resize' });
    expect(handle.tagName).toBe('DIV');
    expect(handle.getAttribute('role')).toBe('separator');
    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-label')).toBe('Resize');
    expect(handle.getAttribute('aria-valuenow')).toBe('40');
    expect(handle.getAttribute('aria-valuemin')).toBe('20');
    expect(handle.getAttribute('aria-valuemax')).toBe('80');
  });
});

describe('lily-splitter controlled size', () => {
  it('patches a size attribute change in place instead of rebuilding', () => {
    const { el, root, handle } = mount({ size: '50' });
    el.setAttribute('size', '30');
    expect(el.querySelector('.lily-splitter')).toBe(root);
    expect(el.querySelector('.lily-splitter__handle')).toBe(handle);
    expect(root.style.getPropertyValue('--lily-splitter-size')).toBe('30%');
    expect(handle.getAttribute('aria-valuenow')).toBe('30');
  });

  it('keeps the measured root attached while a controlled host echoes size during a drag', () => {
    const { el, root, handle } = mount({ size: '50' });
    el.addEventListener('change', (e) =>
      el.setAttribute('size', String((e as CustomEvent<number>).detail)),
    );

    handle.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 150 }));
    flushFrames();

    // The echo must not have detached the root (a rebuild would zero the rect).
    expect(el.querySelector('.lily-splitter')).toBe(root);
    expect(root.isConnected).toBe(true);
    expect(handle.getAttribute('aria-valuenow')).toBe('75');
    expect(root.style.getPropertyValue('--lily-splitter-size')).toBe('75%');

    // The next move still measures the same (attached) root correctly.
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 30 }));
    flushFrames();
    expect(handle.getAttribute('aria-valuenow')).toBe('15');

    window.dispatchEvent(new MouseEvent('pointerup'));
  });
});

describe('lily-splitter drag end', () => {
  it('flushes the last pointermove on pointerup instead of discarding it', () => {
    const { el, handle } = mount({ size: '50' });
    const seen: number[] = [];
    el.addEventListener('change', (e) => seen.push((e as CustomEvent<number>).detail));

    handle.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
    // pointerup arrives before the batching frame fires.
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 120 }));
    window.dispatchEvent(new MouseEvent('pointerup'));

    expect(seen).toEqual([60]);
    expect(handle.getAttribute('aria-valuenow')).toBe('60');

    // The drag is fully torn down: further moves change nothing.
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 40 }));
    flushFrames();
    expect(handle.getAttribute('aria-valuenow')).toBe('60');
  });
});

describe('lily-splitter disconnect during drag', () => {
  it('discards the pending flush against a detached (zero-size) root instead of applying NaN', () => {
    const { el, root, handle } = mount({ size: '50' });
    const seen: number[] = [];
    el.addEventListener('change', (e) => seen.push((e as CustomEvent<number>).detail));

    handle.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }));
    // A pending move at clientX 0: against a 0-width rect, (0 - 0) / 0 → NaN.
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 0 }));

    // Detaching collapses the measured rect to all zeros …
    root.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    // … and removal runs disconnectedCallback → stop() → flush().
    el.remove();

    // The flush must be discarded: no NaN value, no change event.
    expect(seen).toEqual([]);
    expect(handle.getAttribute('aria-valuenow')).toBe('50');

    // The drag is fully torn down: further moves change nothing.
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 100 }));
    flushFrames();
    expect(handle.getAttribute('aria-valuenow')).toBe('50');
  });
});

describe('lily-splitter keyboard', () => {
  it('keeps focus on the handle after arrow-key resizing with a controlled echo', () => {
    const { el, handle } = mount({ size: '50' });
    el.addEventListener('change', (e) =>
      el.setAttribute('size', String((e as CustomEvent<number>).detail)),
    );

    handle.focus();
    handle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );

    expect(handle.isConnected).toBe(true);
    expect(document.activeElement).toBe(handle);
    expect(handle.getAttribute('aria-valuenow')).toBe('55');
  });
});
