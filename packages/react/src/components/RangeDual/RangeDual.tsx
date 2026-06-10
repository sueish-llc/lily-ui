import { forwardRef, type CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export type RangeDualValue = [number, number];

export interface RangeDualProps {
  /** Minimum bound. @default 0 */
  min?: number;
  /** Maximum bound. @default 100 */
  max?: number;
  /** Step. @default 1 */
  step?: number;
  /** Controlled `[low, high]` value. */
  value?: RangeDualValue;
  /** Initial value when uncontrolled. @default [min, max] */
  defaultValue?: RangeDualValue;
  /** Called with the updated `[low, high]`. */
  onChange?: (value: RangeDualValue) => void;
  /** Disable both thumbs. @default false */
  disabled?: boolean;
  /** Accessible label for the lower thumb. @default 'Minimum' */
  minLabel?: string;
  /** Accessible label for the upper thumb. @default 'Maximum' */
  maxLabel?: string;
  id?: string;
  className?: string;
}

/**
 * RangeDual — a two-thumb range slider for selecting a span (e.g. a price
 * range). Each thumb is a native range input, so keyboard support is built in;
 * the thumbs cannot cross.
 *
 * @example
 * ```tsx
 * <RangeDual min={0} max={1000} step={10} defaultValue={[200, 800]} />
 * ```
 */
export const RangeDual = forwardRef<HTMLDivElement, RangeDualProps>(function RangeDual(
  { min = 0, max = 100, step = 1, value: valueProp, defaultValue, onChange, disabled = false, minLabel = 'Minimum', maxLabel = 'Maximum', id, className },
  ref,
) {
  const [value, setValue] = useControllableState<RangeDualValue>({
    value: valueProp,
    defaultValue: defaultValue ?? [min, max],
    onChange,
  });
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const style = {
    '--lily-range-min': `${pct(lo)}%`,
    '--lily-range-max': `${pct(hi)}%`,
  } as CSSProperties;

  return (
    <div ref={ref} className={cx('lily-range-dual', className)} style={style}>
      <span className="lily-range-dual__track" aria-hidden="true" />
      <span className="lily-range-dual__fill" aria-hidden="true" />
      <input
        className="lily-range-dual__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        disabled={disabled}
        aria-label={minLabel}
        id={id}
        onChange={(e) => setValue([Math.min(Number(e.target.value), hi), hi])}
      />
      <input
        className="lily-range-dual__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        disabled={disabled}
        aria-label={maxLabel}
        onChange={(e) => setValue([lo, Math.max(Number(e.target.value), lo)])}
      />
    </div>
  );
});
