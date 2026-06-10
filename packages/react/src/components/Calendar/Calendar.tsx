import { forwardRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';
import { getDateTimeFormat, today, toPlainDate, toUtcDate, type PlainDateInput } from '../../utils/datetime';
import type { Weekday } from '../DatePicker';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Temporal.PlainDate | null;
  /** Initial selection (uncontrolled). @default null */
  defaultValue?: Temporal.PlainDate | null;
  /** Called with the newly selected date. */
  onChange?: (date: Temporal.PlainDate) => void;
  /** Earliest selectable date. */
  min?: PlainDateInput;
  /** Latest selectable date. */
  max?: PlainDateInput;
  /** Disable individual dates. */
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;
  /** Locale for month/weekday names. */
  locale?: Intl.LocalesArgument;
  /** Which weekday the grid starts on. @default 1 (Monday) */
  weekStartsOn?: Weekday;
  /** Accessible label for the grid. @default 'Calendar' */
  'aria-label'?: string;
  className?: string;
}

const toDate = (d: Temporal.PlainDate) => toUtcDate(d.year, d.month, d.day);
// Formatters are cached per locale + options (a grid formats ~50 labels per render).
const fmt = (d: Temporal.PlainDate, locale: Intl.LocalesArgument, opts: Intl.DateTimeFormatOptions) =>
  getDateTimeFormat(locale, { timeZone: 'UTC', ...opts }).format(toDate(d));

/**
 * Coerce an optional `PlainDateInput` to a `PlainDate` (or `undefined`).
 * Bounds are parsed defensively: an invalid ISO string is ignored (no bound)
 * instead of throwing during render.
 */
function toBound(input: PlainDateInput | undefined): Temporal.PlainDate | undefined {
  if (input == null) return undefined;
  try {
    return toPlainDate(input);
  } catch {
    return undefined;
  }
}

/**
 * Calendar — an inline month grid for date selection (a DatePicker without the
 * popup). Days are buttons; the selection is conveyed by fill + `aria-pressed`.
 *
 * @example
 * ```tsx
 * <Calendar defaultValue={today()} onChange={setDate} locale="ja-JP" />
 * ```
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { value: valueProp, defaultValue = null, onChange, min, max, isDateDisabled, locale, weekStartsOn = 1, className, ...rest },
  ref,
) {
  const [selected, setSelected] = useControllableState<Temporal.PlainDate | null>({
    value: valueProp,
    defaultValue,
    onChange: (v) => v && onChange?.(v),
  });
  const [view, setView] = useState(() => (selected ?? today()).with({ day: 1 }));
  const minD = toBound(min);
  const maxD = toBound(max);

  // Resolved once per render instead of once per day cell.
  const todayDate = today();

  const firstOffset = (view.dayOfWeek - weekStartsOn + 7) % 7;
  const gridStart = view.subtract({ days: firstOffset });
  const days = Array.from({ length: 42 }, (_, i) => gridStart.add({ days: i }));
  const weekdays = Array.from({ length: 7 }, (_, i) => fmt(gridStart.add({ days: i }), locale, { weekday: 'short' }));

  const disabled = (d: Temporal.PlainDate) =>
    (minD && Temporal.PlainDate.compare(d, minD) < 0) ||
    (maxD && Temporal.PlainDate.compare(d, maxD) > 0) ||
    (isDateDisabled?.(d) ?? false);

  return (
    <div ref={ref} className={cx('lily-calendar', className)} {...rest}>
      <div className="lily-calendar__header">
        <button type="button" className="lily-calendar__nav" aria-label="前の月" onClick={() => setView(view.subtract({ months: 1 }))}>
          <span aria-hidden="true">‹</span>
        </button>
        <span className="lily-calendar__title" aria-live="polite">
          {fmt(view, locale, { year: 'numeric', month: 'long' })}
        </span>
        <button type="button" className="lily-calendar__nav" aria-label="次の月" onClick={() => setView(view.add({ months: 1 }))}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="lily-calendar__grid" role="group" aria-label={rest['aria-label'] ?? 'Calendar'}>
        {weekdays.map((wd, i) => (
          <span key={i} className="lily-calendar__weekday" aria-hidden="true">
            {wd}
          </span>
        ))}
        {days.map((d) => {
          const outside = d.month !== view.month;
          const isSelected = selected != null && d.equals(selected);
          return (
            <button
              key={d.toString()}
              type="button"
              className={cx('lily-calendar__day', outside && 'lily-calendar__day--outside', d.equals(todayDate) && 'lily-calendar__day--today')}
              aria-pressed={isSelected}
              aria-label={fmt(d, locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              disabled={disabled(d)}
              onClick={() => {
                setSelected(d);
                if (outside) setView(d.with({ day: 1 }));
              }}
            >
              {d.day}
            </button>
          );
        })}
      </div>
    </div>
  );
});
