import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface AffixProps extends HTMLAttributes<HTMLDivElement> {
  /** Sticky offset in px from the edge. @default 0 */
  offset?: number;
  /** Which edge to stick to. @default 'top' */
  position?: 'top' | 'bottom';
  children?: ReactNode;
}

/**
 * Affix — stick its content to the top (or bottom) of the viewport once
 * scrolled into position, using CSS `position: sticky`.
 *
 * @example
 * ```tsx
 * <Affix offset={16}><Toolbar /></Affix>
 * ```
 */
export const Affix = forwardRef<HTMLDivElement, AffixProps>(function Affix(
  { offset = 0, position = 'top', className, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('lily-affix', position === 'bottom' && 'lily-affix--bottom', className)}
      style={{ '--lily-affix-offset': `${offset}px`, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
});
