import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation. @default 'horizontal' */
  orientation?: DividerOrientation;
  /** Use the stronger border color. @default false */
  strong?: boolean;
  /** Horizontal alignment of the label, if any. @default 'center' */
  align?: 'start' | 'center' | 'end';
  /** Optional centered label (horizontal only). */
  children?: ReactNode;
}

/**
 * Divider — a separator rule. Horizontal by default; can be vertical (for use
 * inside a flex row) or carry a centered label.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider>または</Divider>
 * <Divider orientation="vertical" />
 * ```
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', strong = false, align = 'center', className, children, ...rest },
  ref,
) {
  const labeled = children != null && orientation === 'horizontal';
  const classes = cx(
    'lily-divider',
    orientation === 'vertical' && 'lily-divider--vertical',
    strong && 'lily-divider--strong',
    labeled && 'lily-divider--labeled',
    labeled && align !== 'center' && `lily-divider--${align}`,
    className,
  );

  return (
    <div
      ref={ref}
      className={classes}
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      {...rest}
    >
      {labeled ? <span>{children}</span> : null}
    </div>
  );
});
