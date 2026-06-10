import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type MarkStatus = 'warning' | 'success' | 'info' | 'danger' | 'primary';

export interface MarkProps extends HTMLAttributes<HTMLElement> {
  /**
   * Semantic color intent. The highlight is decorative — meaning must be
   * conveyed in the text itself (AAA 1.4.1). @default 'warning'
   */
  status?: MarkStatus;
  children?: ReactNode;
}

const CLASS = 'lily-mark';

/**
 * Mark — highlights a text run with a semantic-color background using the
 * native `<mark>` element. The highlight is purely decorative; the text itself
 * must convey the meaning (WCAG 1.4.1).
 *
 * @example
 * ```tsx
 * <p>
 *   Please read the <Mark>important notice</Mark> before continuing.
 * </p>
 * <Mark status="success">Approved</Mark>
 * ```
 */
export const Mark = forwardRef<HTMLElement, MarkProps>(function Mark(
  { status = 'warning', className, children, ...rest },
  ref,
) {
  return (
    <mark
      ref={ref}
      className={cx(CLASS, `${CLASS}--${status}`, className)}
      {...rest}
    >
      {children}
    </mark>
  );
});
