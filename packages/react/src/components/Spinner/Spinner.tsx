import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export type SpinnerVariant = 'border' | 'grow';
export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Animation style. @default 'border' */
  variant?: SpinnerVariant;
  /** Size. @default 'md' */
  size?: SpinnerSize;
  /** Accessible status label. @default 'Loading' */
  label?: string;
}

const CLASS = 'lily-spinner';

/**
 * Spinner — a loading indicator. Inherits color from `currentColor`.
 *
 * Exposes `role="status"` with a visually-hidden label so screen readers
 * announce the loading state.
 *
 * @example
 * ```tsx
 * <Spinner /> <Spinner variant="grow" size="sm" label="送信中" />
 * ```
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { variant = 'border', size = 'md', label = 'Loading', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      className={cx(CLASS, `${CLASS}--${variant}`, `${CLASS}--${size}`, className)}
      {...rest}
    >
      <span className="lily-visually-hidden">{label}</span>
    </span>
  );
});
