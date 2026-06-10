import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Scroll axis. @default 'y' */
  axis?: 'both' | 'x' | 'y';
  /** Max block size before scrolling (px or any CSS length). */
  maxHeight?: number | string;
  children?: ReactNode;
}

/**
 * ScrollArea — a scroll container with a slim, themed scrollbar that is
 * consistent across browsers.
 *
 * @example
 * ```tsx
 * <ScrollArea maxHeight={240}>…long content…</ScrollArea>
 * ```
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { axis = 'y', maxHeight, className, style, children, ...rest },
  ref,
) {
  const mh = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  return (
    <div
      ref={ref}
      className={cx('lily-scroll-area', axis !== 'both' && `lily-scroll-area--${axis}`, className)}
      style={{ maxHeight: mh, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
});
