import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for the dismiss action. @default 'Close' */
  label?: string;
}

const CLASS = 'lily-close';

/**
 * CloseButton — a standard dismiss control (×).
 *
 * Renders a native `<button>` with an accessible label and a decorative glyph.
 *
 * @example
 * ```tsx
 * <CloseButton onClick={dismiss} label="Dismiss notification" />
 * ```
 */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(function CloseButton(
  { label = 'Close', className, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cx(CLASS, className)}
      aria-label={label}
      {...rest}
    >
      <span aria-hidden="true">&times;</span>
    </button>
  );
});
