import { forwardRef, useEffect, useRef, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface SplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Start (first) pane content. */
  start: ReactNode;
  /** End (second) pane content. */
  end: ReactNode;
  /** Split direction. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Controlled size of the start pane, in percent. */
  size?: number;
  /** Initial size of the start pane, in percent. @default 50 */
  defaultSize?: number;
  /** Called with the new start-pane percent. */
  onChange?: (size: number) => void;
  /** Minimum start-pane percent. @default 10 */
  min?: number;
  /** Maximum start-pane percent. @default 90 */
  max?: number;
  /** Keyboard step (percent). @default 5 */
  step?: number;
  /** Accessible label for the resize handle. @default 'Resize panels' */
  handleLabel?: string;
}

/**
 * Splitter — two resizable panes with a draggable, keyboard-operable divider
 * (`role="separator"`). Drag the handle, or focus it and use the arrow keys.
 *
 * @example
 * ```tsx
 * <Splitter start={<Nav />} end={<Main />} defaultSize={30} />
 * ```
 */
export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(function Splitter(
  { start, end, orientation = 'horizontal', size: sizeProp, defaultSize = 50, onChange, min = 10, max = 90, step = 5, handleLabel = 'Resize panels', className, style, ...rest },
  ref,
) {
  const [size, setSize] = useControllableState({ value: sizeProp, defaultValue: defaultSize, onChange });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vertical = orientation === 'vertical';
  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  // Ends the active drag (removes window listeners, flushes the pending move).
  // Kept in a ref so unmount can clean up a drag that is still in progress.
  const endDragRef = useRef<(() => void) | null>(null);
  useEffect(() => () => endDragRef.current?.(), []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    endDragRef.current?.();

    let frame = 0;
    let pending: { clientX: number; clientY: number } | null = null;

    // Apply the most recent pointer position (if any) to the pane size.
    const apply = () => {
      if (!pending) return;
      const { clientX, clientY } = pending;
      pending = null;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = vertical
        ? ((clientY - rect.top) / rect.height) * 100
        : ((clientX - rect.left) / rect.width) * 100;
      setSize(clamp(Math.round(pct)));
    };

    // Batch pointermove bursts to one state update per animation frame.
    const move = (ev: globalThis.PointerEvent) => {
      pending = { clientX: ev.clientX, clientY: ev.clientY };
      if (frame === 0) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          apply();
        });
      }
    };

    const end = () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      // Flush the last pending move so the final position is not dropped.
      apply();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      endDragRef.current = null;
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    endDragRef.current = end;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dec = vertical ? 'ArrowUp' : 'ArrowLeft';
    const inc = vertical ? 'ArrowDown' : 'ArrowRight';
    if (e.key === dec) {
      e.preventDefault();
      setSize(clamp(size - step));
    } else if (e.key === inc) {
      e.preventDefault();
      setSize(clamp(size + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSize(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSize(max);
    }
  };

  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      ref={setRefs}
      className={cx('lily-splitter', vertical && 'lily-splitter--vertical', className)}
      style={{ '--lily-splitter-size': `${size}%`, ...style } as CSSProperties}
      {...rest}
    >
      <div className="lily-splitter__panel lily-splitter__panel--start">{start}</div>
      {/* Focusable window-splitter (WAI-ARIA): a separator operable by pointer + arrow keys. */}
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        className="lily-splitter__handle"
        role="separator"
        tabIndex={0}
        aria-orientation={vertical ? 'horizontal' : 'vertical'}
        aria-label={handleLabel}
        aria-valuenow={Math.round(size)}
        aria-valuemin={min}
        aria-valuemax={max}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      />
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div className="lily-splitter__panel lily-splitter__panel--end">{end}</div>
    </div>
  );
});
