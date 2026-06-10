import { forwardRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';
import { DatePicker, type Weekday } from '../DatePicker';
import type { PlainDateInput } from '../../utils/datetime';

/** A `[start, end]` date range (either side may be `null`). */
export type DateRange = [Temporal.PlainDate | null, Temporal.PlainDate | null];

export interface DateRangePickerProps {
  /** Controlled `[start, end]` range. */
  value?: DateRange;
  /** Initial range when uncontrolled. @default [null, null] */
  defaultValue?: DateRange;
  /** Called with the updated range. */
  onChange?: (range: DateRange) => void;
  /** Earliest selectable date. */
  min?: PlainDateInput;
  /** Latest selectable date. */
  max?: PlainDateInput;
  /** BCP-47 locale for month/weekday names. */
  locale?: Intl.LocalesArgument;
  /** Which weekday the grid starts on. @default 1 (Monday) */
  weekStartsOn?: Weekday;
  /** Disable both fields. @default false */
  disabled?: boolean;
  /** Accessible label for the start field. @default 'Start date' */
  startLabel?: string;
  /** Accessible label for the end field. @default 'End date' */
  endLabel?: string;
  /** Separator between the two fields. @default '–' */
  separator?: ReactNode;
  className?: string;
}

/**
 * DateRangePicker — pick a start and end date with two coordinated
 * {@link DatePicker}s. The start field caps the end's minimum and vice-versa,
 * so the range can never invert.
 *
 * @example
 * ```tsx
 * <DateRangePicker onChange={([from, to]) => …} />
 * ```
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(
  { value: valueProp, defaultValue = [null, null], onChange, min, max, locale, weekStartsOn = 1, disabled = false, startLabel = 'Start date', endLabel = 'End date', separator = '–', className },
  ref,
) {
  const [range, setRange] = useControllableState<DateRange>({ value: valueProp, defaultValue, onChange });
  const [start, end] = range;

  return (
    <div ref={ref} className={cx('lily-date-range-picker', className)}>
      <DatePicker
        value={start}
        max={end ?? max}
        min={min}
        locale={locale}
        weekStartsOn={weekStartsOn}
        disabled={disabled}
        inputProps={{ 'aria-label': startLabel }}
        onChange={(d) => setRange([d, end])}
      />
      <span className="lily-date-range-picker__sep" aria-hidden="true">
        {separator}
      </span>
      <DatePicker
        value={end}
        min={start ?? min}
        max={max}
        locale={locale}
        weekStartsOn={weekStartsOn}
        disabled={disabled}
        inputProps={{ 'aria-label': endLabel }}
        onChange={(d) => setRange([start, d])}
      />
    </div>
  );
});
