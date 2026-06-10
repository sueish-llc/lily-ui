import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type StatTrend = 'up' | 'down' | 'neutral';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** Metric label. */
  label: ReactNode;
  /** The primary value. */
  value: ReactNode;
  /** Change indicator text (e.g. "+12%"). */
  delta?: ReactNode;
  /** Direction of the delta. @default 'neutral' */
  trend?: StatTrend;
  /** Supporting note under the value. */
  help?: ReactNode;
  /** SR words for the trend. @default { up: 'increase', down: 'decrease' } */
  trendLabels?: { up: string; down: string };
}

/**
 * Stat — a KPI tile (label, value, optional trend delta). The delta pairs a
 * directional arrow with a status color and visually-hidden text, so the trend
 * is conveyed beyond color.
 *
 * @example
 * ```tsx
 * <Stat label="売上" value="¥1.2M" delta="+12%" trend="up" help="前月比" />
 * ```
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, delta, trend = 'neutral', help, trendLabels = { up: 'increase', down: 'decrease' }, className, ...rest },
  ref,
) {
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '';
  return (
    <div ref={ref} className={cx('lily-stat', className)} {...rest}>
      <span className="lily-stat__label">{label}</span>
      <span className="lily-stat__value">{value}</span>
      {delta != null && (
        <span className={cx('lily-stat__delta', trend !== 'neutral' && `lily-stat__delta--${trend}`)}>
          {arrow && (
            <span aria-hidden="true" className="lily-stat__arrow">
              {arrow}
            </span>
          )}
          {trend !== 'neutral' && (
            <span className="lily-visually-hidden">{trend === 'up' ? trendLabels.up : trendLabels.down}: </span>
          )}
          {delta}
        </span>
      )}
      {help != null && <span className="lily-stat__help">{help}</span>}
    </div>
  );
});
