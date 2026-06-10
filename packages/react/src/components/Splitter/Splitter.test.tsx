import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Splitter } from './Splitter';

describe('Splitter', () => {
  it('resizes via keyboard within bounds', async () => {
    const onChange = vi.fn();
    render(<Splitter start="A" end="B" defaultSize={50} step={10} min={10} max={90} onChange={onChange} />);
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith(60);
    expect(handle).toHaveAttribute('aria-valuenow', '60');
  });
});

describe('Splitter pointer drag', () => {
  // jsdom has no `PointerEvent`; listeners fire by event *type*, so a
  // `MouseEvent` carrying coordinates stands in for pointer moves.
  const pointerMove = (clientX: number) =>
    fireEvent(window, new MouseEvent('pointermove', { clientX, clientY: 0 }));

  // Queue animation frames so the rAF batching can be asserted and flushed
  // deterministically.
  let frames: FrameRequestCallback[] = [];
  const cancelSpy = vi.fn();

  const flushFrames = () => {
    const pending = frames.splice(0);
    pending.forEach((cb) => act(() => cb(0)));
  };

  beforeEach(() => {
    frames = [];
    cancelSpy.mockClear();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (cb: FrameRequestCallback) => frames.push(cb),
    );
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(cancelSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** Render a Splitter whose container is 100px wide (clientX maps to percent). */
  function setup(onChange?: (size: number) => void) {
    const { container, unmount } = render(
      <Splitter start="A" end="B" defaultSize={50} min={10} max={90} onChange={onChange} />,
    );
    const root = container.firstElementChild as HTMLElement;
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    } as DOMRect);
    const handle = screen.getByRole('separator', { name: 'Resize panels' });
    return { handle, unmount };
  }

  it('batches pointer moves per animation frame and flushes the last move on pointerup', () => {
    const onChange = vi.fn();
    const { handle } = setup(onChange);

    fireEvent.pointerDown(handle);
    pointerMove(30);
    pointerMove(20);
    // Both moves are coalesced into a single scheduled frame; nothing applied yet.
    expect(frames).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();

    // Ending the drag before the frame runs must not drop the final position.
    fireEvent.pointerUp(window);
    expect(onChange).toHaveBeenLastCalledWith(20);
    expect(handle).toHaveAttribute('aria-valuenow', '20');

    // Listeners are gone: further moves change nothing.
    pointerMove(80);
    flushFrames();
    expect(handle).toHaveAttribute('aria-valuenow', '20');
  });

  it('applies a batched move when the animation frame fires', () => {
    const { handle } = setup();
    fireEvent.pointerDown(handle);
    pointerMove(30);
    flushFrames();
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    fireEvent.pointerUp(window);
  });

  it('ends the drag on pointercancel and removes the window listeners', () => {
    const { handle } = setup();
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    fireEvent.pointerDown(handle);
    pointerMove(30);
    fireEvent.pointerCancel(window);

    // The pending move is flushed, the scheduled frame canceled, listeners removed.
    expect(handle).toHaveAttribute('aria-valuenow', '30');
    expect(cancelSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));

    pointerMove(80);
    flushFrames();
    expect(handle).toHaveAttribute('aria-valuenow', '30');
  });

  it('cleans up window listeners and the pending frame on unmount mid-drag', () => {
    const { handle, unmount } = setup();
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    fireEvent.pointerDown(handle);
    pointerMove(30);
    unmount();

    expect(cancelSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));
  });
});
