import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value. @default 0 */
  value?: number;
  /** Minimum value. @default 0 */
  min?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Striped fill. @default false */
  striped?: boolean;
  /** Show the percentage as a label inside the bar. @default false */
  showLabel?: boolean;
  /** Accessible label for the progress bar. */
  label?: string;
}

const CLASS = 'lily-progress';

/**
 * Progress — a determinate progress bar.
 *
 * Exposes `role="progressbar"` with `aria-valuenow/min/max` for screen readers.
 *
 * @example
 * ```tsx
 * <Progress value={60} label="Upload progress" showLabel />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, min = 0, max = 100, striped, showLabel, label, className, style, ...rest },
  ref,
) {
  const clamped = Math.min(max, Math.max(min, value));
  const percent = max === min ? 0 : Math.round(((clamped - min) / (max - min)) * 100);

  return (
    <div
      ref={ref}
      className={cx(CLASS, striped && `${CLASS}--striped`, className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      {...rest}
    >
      <div
        className={`${CLASS}__bar`}
        style={{ ['--lily-progress-value' as string]: percent, ...style }}
      >
        {showLabel && `${percent}%`}
      </div>
    </div>
  );
});
