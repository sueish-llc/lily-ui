import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/vue';
import Splitter from './Splitter.vue';

// jsdom may lack PointerEvent; the handlers only need the event type (and
// clientX/clientY for moves), so MouseEvent stands in fine.
const pointer = (type: string, init?: MouseEventInit) =>
  new MouseEvent(type, { bubbles: true, cancelable: true, ...init });

const DRAG_TYPES = ['pointermove', 'pointerup', 'pointercancel'] as const;

describe('Splitter', () => {
  // Deterministic requestAnimationFrame: queue callbacks and flush by hand.
  let nextRafId: number;
  let rafQueue: Map<number, FrameRequestCallback>;

  const flushFrames = () => {
    const cbs = [...rafQueue.values()];
    rafQueue.clear();
    cbs.forEach((cb) => cb(0));
  };

  beforeEach(() => {
    nextRafId = 1;
    rafQueue = new Map();
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number => {
      const id = nextRafId++;
      rafQueue.set(id, cb);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number): void => {
      rafQueue.delete(id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const renderSplitter = () => {
    const utils = render(Splitter, {
      props: { modelValue: 50 },
      slots: { start: 'left', end: 'right' },
    });
    const handle = utils.container.querySelector<HTMLElement>('.lily-splitter__handle');
    if (!handle) throw new Error('handle not rendered');
    return { ...utils, handle };
  };

  it('renders the handle with the same markup as the React source of truth', () => {
    const { handle } = renderSplitter();
    expect(handle.tagName).toBe('DIV');
    expect(handle).toHaveAttribute('role', 'separator');
    expect(handle).toHaveAttribute('tabindex', '0');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-label', 'Resize panels');
    expect(handle).toHaveAttribute('aria-valuenow', '50');
    expect(handle).toHaveAttribute('aria-valuemin', '10');
    expect(handle).toHaveAttribute('aria-valuemax', '90');
  });

  it('batches pointermove through requestAnimationFrame', () => {
    const { handle, emitted } = renderSplitter();
    handle.dispatchEvent(pointer('pointerdown'));

    window.dispatchEvent(pointer('pointermove', { clientX: 100 }));
    window.dispatchEvent(pointer('pointermove', { clientX: 200 }));
    // Nothing applied until the frame fires, and the burst shares one frame.
    expect(emitted('update:modelValue') ?? []).toHaveLength(0);
    expect(rafQueue.size).toBe(1);

    flushFrames();
    expect(emitted('update:modelValue')).toHaveLength(1);

    window.dispatchEvent(pointer('pointerup'));
  });

  it('ends the drag on pointercancel and removes the window listeners', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { handle, emitted } = renderSplitter();
    handle.dispatchEvent(pointer('pointerdown'));

    window.dispatchEvent(pointer('pointermove', { clientX: 100 }));
    flushFrames();
    const applied = (emitted('update:modelValue') ?? []).length;
    expect(applied).toBeGreaterThan(0);

    window.dispatchEvent(pointer('pointercancel'));
    for (const type of DRAG_TYPES) {
      expect(removeSpy).toHaveBeenCalledWith(type, expect.any(Function));
    }

    // Listeners are really gone: further moves change nothing.
    window.dispatchEvent(pointer('pointermove', { clientX: 300 }));
    flushFrames();
    expect((emitted('update:modelValue') ?? []).length).toBe(applied);
  });

  it('flushes the last pending move when the drag ends', () => {
    const { handle, emitted } = renderSplitter();
    handle.dispatchEvent(pointer('pointerdown'));

    window.dispatchEvent(pointer('pointermove', { clientX: 100 }));
    expect(emitted('update:modelValue') ?? []).toHaveLength(0); // frame still pending

    window.dispatchEvent(pointer('pointerup'));
    // The pending frame was canceled and the move applied synchronously.
    expect(rafQueue.size).toBe(0);
    expect(emitted('update:modelValue')).toHaveLength(1);
  });

  it('cleans up window listeners and the pending frame on unmount mid-drag', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { handle, unmount } = renderSplitter();
    handle.dispatchEvent(pointer('pointerdown'));
    window.dispatchEvent(pointer('pointermove', { clientX: 100 }));
    expect(rafQueue.size).toBe(1);

    unmount();
    for (const type of DRAG_TYPES) {
      expect(removeSpy).toHaveBeenCalledWith(type, expect.any(Function));
    }
    expect(rafQueue.size).toBe(0);
  });
});
