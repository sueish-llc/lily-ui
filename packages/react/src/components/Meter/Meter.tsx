import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type MeterStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value. */
  value: number;
  /** Range floor. @default 0 */
  min?: number;
  /** Range ceiling. @default 100 */
  max?: number;
  /** Visible label. */
  label?: ReactNode;
  /** Bar color. @default 'primary' */
  status?: MeterStatus;
  /** Human-readable value text for AT (e.g. "75 GB of 100 GB"). */
  valueText?: string;
  /** Show the numeric value on the right of the header. @default false */
  showValue?: boolean;
}

/**
 * Meter — a static scalar measurement within a known range (disk usage, score),
 * using `role="meter"`. Distinct from Progress (task completion).
 *
 * @example
 * ```tsx
 * <Meter label="ストレージ" value={75} valueText="100GB中75GB" status="warning" showValue />
 * ```
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  { value, min = 0, max = 100, label, status = 'primary', valueText, showValue = false, className, ...rest },
  ref,
) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div ref={ref} className={cx('lily-meter', className)} {...rest}>
      {(label != null || showValue) && (
        <div className="lily-meter__header">
          {label != null ? <span>{label}</span> : <span />}
          {showValue && <span className="lily-meter__value">{valueText ?? value}</span>}
        </div>
      )}
      <div
        className="lily-meter__track"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={valueText}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        <div
          className="lily-meter__fill"
          data-status={status !== 'primary' ? status : undefined}
          style={{ width: `${pct}%` } as CSSProperties}
        />
      </div>
    </div>
  );
});
