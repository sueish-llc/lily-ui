import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import { getDateTimeFormat, today, toPlainDateTime, toUtcDate, type PlainDateTimeInput } from '../../utils/datetime';
import { useControllableState, useDismiss } from '../../hooks';
import type { SizeToken } from '../../tokens';

const CLASS = 'lily-date-time-picker';

/** Day-of-week the calendar grid starts on: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateTimePickerProps {
  /** Selected date+time (controlled). Pass `null` for "no selection". */
  value?: Temporal.PlainDateTime | null;
  /** Initial date+time (uncontrolled). @default null */
  defaultValue?: Temporal.PlainDateTime | null;
  /** Called with the new value (or `null` when cleared). */
  onChange?: (value: Temporal.PlainDateTime | null) => void;
  /** Earliest selectable instant (inclusive). ISO datetime strings accepted. */
  min?: PlainDateTimeInput;
  /** Latest selectable instant (inclusive). ISO datetime strings accepted. */
  max?: PlainDateTimeInput;
  /** BCP-47 locale for month / weekday names. Defaults to the host locale. */
  locale?: Intl.LocalesArgument;
  /** Which weekday the grid starts on. @default 1 (Monday) */
  weekStartsOn?: Weekday;
  /** Minute increment for the minute stepper. @default 5 */
  minuteStep?: number;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Control size. @default 'md' */
  size?: Extract<SizeToken, 'sm' | 'md' | 'lg'>;
  /** Semantic status (used for the invalid/danger boundary styling). */
  status?: 'danger';
  /** Align the calendar popup to the field's end (right) edge. @default false */
  alignEnd?: boolean;
  /** Accessible label for the calendar toggle button. @default 'Choose date and time' */
  toggleLabel?: string;
  /** `id` for the text input (an auto-generated id is used otherwise). */
  id?: string;
  /** `name` for the text input, for form submission. */
  name?: string;
  className?: string;
}

/** Coerce an optional `PlainDateTimeInput` to a `PlainDateTime` (or `undefined`). */
function toBound(input: PlainDateTimeInput | undefined): Temporal.PlainDateTime | undefined {
  return input == null ? undefined : toPlainDateTime(input);
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Format a `Temporal.PlainDate` for display via `Intl.DateTimeFormat`. We go
 * through a fixed-UTC `Date` because option support on `toLocaleString` still
 * varies across engines; all date *logic* stays in Temporal.
 */
function formatDay(
  date: Temporal.PlainDate,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  const utc = toUtcDate(date.year, date.month, date.day);
  // Cached per locale + options: a month view formats ~57 labels per render.
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(utc);
}

/**
 * DateTimePicker — an accessible, Temporal-powered picker that combines a month
 * calendar with hour/minute steppers. The value is a **`Temporal.PlainDateTime`**
 * (this library models all date/time with the Temporal API).
 *
 * The calendar is rendered from plain elements and CSS (no native
 * `<input type="datetime-local">`), so its look and keyboard model are identical
 * across browsers, including Firefox.
 *
 * Calendar keyboard model (focus inside the grid):
 * - Arrow keys move by day / week, `Home`/`End` to week edges
 * - `PageUp`/`PageDown` move by month (hold `Shift` for years)
 * - `Enter`/`Space` selects, `Escape` closes
 *
 * @example
 * ```tsx
 * <DateTimePicker
 *   defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')}
 *   minuteStep={15}
 *   onChange={setWhen}
 * />
 * ```
 */
export function DateTimePicker({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  locale,
  weekStartsOn = 1,
  minuteStep = 5,
  disabled = false,
  size = 'md',
  status,
  alignEnd = false,
  toggleLabel = 'Choose date and time',
  id,
  name,
  className,
}: DateTimePickerProps) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const popupId = `${baseId}-popup`;
  const titleId = `${baseId}-title`;

  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const focusDayRef = useRef(false);

  const minDt = useMemo(() => toBound(min), [min]);
  const maxDt = useMemo(() => toBound(max), [max]);

  const [selected, setSelected] = useControllableState<Temporal.PlainDateTime | null>({
    value,
    defaultValue,
    onChange,
  });

  const [open, setOpen] = useState(false);
  const [todayDate, setTodayDate] = useState(() => today());
  // The clock kept while the popup is open; defaults to the selected time or 00:00.
  const [draftTime, setDraftTime] = useState<Temporal.PlainTime>(() =>
    selected ? selected.toPlainTime() : Temporal.PlainTime.from({ hour: 0, minute: 0 }),
  );
  const [focusedDate, setFocusedDate] = useState<Temporal.PlainDate>(() =>
    clampDate(selected ? selected.toPlainDate() : todayDate, minDt, maxDt),
  );

  // Resync the draft clock when the value changes from the outside. Keyed on
  // the ISO string so a re-created instance for the same moment is a no-op.
  const selectedIso = selected ? selected.toString() : '';
  useEffect(() => {
    if (selectedIso) setDraftTime(Temporal.PlainDateTime.from(selectedIso).toPlainTime());
  }, [selectedIso]);

  function isSelectable(date: Temporal.PlainDate): boolean {
    // Compare against the date part of the bounds so a day stays reachable even
    // when only part of it is in range; the clock is clamped on commit.
    if (minDt && Temporal.PlainDate.compare(date, minDt.toPlainDate()) < 0) return false;
    if (maxDt && Temporal.PlainDate.compare(date, maxDt.toPlainDate()) > 0) return false;
    return true;
  }

  function clampDateToBounds(date: Temporal.PlainDate): Temporal.PlainDate {
    return clampDate(date, minDt, maxDt);
  }

  function moveFocus(date: Temporal.PlainDate) {
    focusDayRef.current = true;
    setFocusedDate(clampDateToBounds(date));
  }

  function openPopup() {
    if (disabled) return;
    const now = today();
    setTodayDate(now);
    focusDayRef.current = true;
    setFocusedDate(clampDateToBounds(selected ? selected.toPlainDate() : now));
    setOpen(true);
  }

  function closePopup(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }

  /** Combine a day with the draft clock, clamp to bounds, and report it. */
  function commit(date: Temporal.PlainDate, time: Temporal.PlainTime, close: boolean) {
    let next = date.toPlainDateTime(time);
    if (minDt && Temporal.PlainDateTime.compare(next, minDt) < 0) next = minDt;
    if (maxDt && Temporal.PlainDateTime.compare(next, maxDt) > 0) next = maxDt;
    setSelected(next);
    setDraftTime(next.toPlainTime());
    setFocusedDate(next.toPlainDate());
    if (close) closePopup(true);
  }

  function selectDate(date: Temporal.PlainDate) {
    if (!isSelectable(date)) return;
    commit(date, draftTime, false);
  }

  function changeTime(time: Temporal.PlainTime) {
    setDraftTime(time);
    const base = selected ? selected.toPlainDate() : focusedDate;
    commit(base, time, false);
  }

  useDismiss(rootRef, open, () => setOpen(false), { escape: false });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !focusDayRef.current) return;
    focusDayRef.current = false;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-date="${focusedDate.toString()}"]`,
    );
    el?.focus();
  }, [open, focusedDate]);

  const viewMonth = focusedDate.toPlainYearMonth();
  const weeks = buildWeeks(viewMonth, weekStartsOn);
  const headerRow = weeks[0] ?? [];

  const prevDisabled =
    minDt != null &&
    Temporal.PlainYearMonth.compare(viewMonth, minDt.toPlainDate().toPlainYearMonth()) <= 0;
  const nextDisabled =
    maxDt != null &&
    Temporal.PlainYearMonth.compare(viewMonth, maxDt.toPlainDate().toPlainYearMonth()) >= 0;

  function onGridKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowLeft':
        moveFocus(focusedDate.subtract({ days: 1 }));
        break;
      case 'ArrowRight':
        moveFocus(focusedDate.add({ days: 1 }));
        break;
      case 'ArrowUp':
        moveFocus(focusedDate.subtract({ days: 7 }));
        break;
      case 'ArrowDown':
        moveFocus(focusedDate.add({ days: 7 }));
        break;
      case 'Home':
        moveFocus(focusedDate.subtract({ days: columnIndex(focusedDate, weekStartsOn) }));
        break;
      case 'End':
        moveFocus(focusedDate.add({ days: 6 - columnIndex(focusedDate, weekStartsOn) }));
        break;
      case 'PageUp':
        moveFocus(focusedDate.subtract(e.shiftKey ? { years: 1 } : { months: 1 }));
        break;
      case 'PageDown':
        moveFocus(focusedDate.add(e.shiftKey ? { years: 1 } : { months: 1 }));
        break;
      case 'Enter':
      case ' ':
        selectDate(focusedDate);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const fieldText = selected
    ? `${selected.toPlainDate().toString()} ${pad2(selected.hour)}:${pad2(selected.minute)}`
    : '';

  return (
    <div
      ref={rootRef}
      className={cx(
        CLASS,
        `${CLASS}--${size}`,
        status === 'danger' && `${CLASS}--invalid`,
        disabled && `${CLASS}--disabled`,
        className,
      )}
    >
      <div className={`${CLASS}__field`}>
        <input
          id={baseId}
          name={name}
          type="text"
          readOnly
          autoComplete="off"
          className={`${CLASS}__input`}
          placeholder="YYYY-MM-DD HH:MM"
          value={fieldText}
          disabled={disabled}
          aria-invalid={status === 'danger' || undefined}
          onClick={() => (open ? undefined : openPopup())}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
              e.preventDefault();
              openPopup();
            }
          }}
        />
        <button
          ref={toggleRef}
          type="button"
          className={`${CLASS}__toggle`}
          aria-label={toggleLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popupId : undefined}
          disabled={disabled}
          onClick={() => (open ? closePopup(false) : openPopup())}
        >
          <CalendarIcon />
        </button>
      </div>

      {open && (
        <div
          id={popupId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className={cx(`${CLASS}__popup`, alignEnd && `${CLASS}__popup--end`)}
        >
          <div className={`${CLASS}__header`}>
            <button
              type="button"
              className={`${CLASS}__nav`}
              aria-label="Previous month"
              disabled={prevDisabled}
              onClick={() => setFocusedDate(clampDateToBounds(focusedDate.subtract({ months: 1 })))}
            >
              <ChevronIcon dir="left" />
            </button>
            <h2 id={titleId} className={`${CLASS}__title`} aria-live="polite">
              {formatDay(focusedDate, locale, { year: 'numeric', month: 'long' })}
            </h2>
            <button
              type="button"
              className={`${CLASS}__nav`}
              aria-label="Next month"
              disabled={nextDisabled}
              onClick={() => setFocusedDate(clampDateToBounds(focusedDate.add({ months: 1 })))}
            >
              <ChevronIcon dir="right" />
            </button>
          </div>

          <table ref={gridRef} className={`${CLASS}__grid`} aria-labelledby={titleId}>
            <thead>
              <tr>
                {headerRow.map((d) => (
                  <th key={d.toString()} scope="col" className={`${CLASS}__weekday`}>
                    <abbr title={formatDay(d, locale, { weekday: 'long' })}>
                      {formatDay(d, locale, { weekday: 'short' })}
                    </abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week[0]?.toString()}>
                  {week.map((date) => {
                    const inMonth = date.month === viewMonth.month;
                    const isSelected = selected != null && date.equals(selected.toPlainDate());
                    const isFocused = date.equals(focusedDate);
                    const isToday = date.equals(todayDate);
                    const selectable = isSelectable(date);
                    return (
                      <td key={date.toString()}>
                        <button
                          type="button"
                          data-date={date.toString()}
                          className={cx(`${CLASS}__day`, {
                            [`${CLASS}__day--outside`]: !inMonth,
                            [`${CLASS}__day--today`]: isToday,
                            [`${CLASS}__day--selected`]: isSelected,
                          })}
                          tabIndex={isFocused ? 0 : -1}
                          aria-pressed={isSelected}
                          aria-current={isToday ? 'date' : undefined}
                          aria-disabled={!selectable || undefined}
                          aria-label={formatDay(date, locale, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                          onClick={() => selectDate(date)}
                          onKeyDown={onGridKeyDown}
                          onFocus={() => setFocusedDate(date)}
                        >
                          {date.day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className={`${CLASS}__time`}>
            <select
              className="lily-select"
              aria-label="Hour"
              value={draftTime.hour}
              onChange={(e) => changeTime(draftTime.with({ hour: Number(e.target.value) }))}
            >
              {hours.map((hr) => (
                <option key={hr} value={hr}>
                  {pad2(hr)}
                </option>
              ))}
            </select>
            <span className={`${CLASS}__time-sep`} aria-hidden="true">
              :
            </span>
            <select
              className="lily-select"
              aria-label="Minute"
              value={draftTime.minute}
              onChange={(e) => changeTime(draftTime.with({ minute: Number(e.target.value) }))}
            >
              {minutes.map((mn) => (
                <option key={mn} value={mn}>
                  {pad2(mn)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Pure date helpers (Temporal) ------------------------------------------

/** Clamp `date` into the date range implied by the `[min, max]` bounds. */
function clampDate(
  date: Temporal.PlainDate,
  min: Temporal.PlainDateTime | undefined,
  max: Temporal.PlainDateTime | undefined,
): Temporal.PlainDate {
  if (min && Temporal.PlainDate.compare(date, min.toPlainDate()) < 0) return min.toPlainDate();
  if (max && Temporal.PlainDate.compare(date, max.toPlainDate()) > 0) return max.toPlainDate();
  return date;
}

/** Column (0-6) of `date` within a week starting on `weekStartsOn`. */
function columnIndex(date: Temporal.PlainDate, weekStartsOn: Weekday): number {
  return ((date.dayOfWeek % 7) - weekStartsOn + 7) % 7;
}

/** A fixed 6×7 grid of dates covering `month`, with leading/trailing days. */
function buildWeeks(
  month: Temporal.PlainYearMonth,
  weekStartsOn: Weekday,
): Temporal.PlainDate[][] {
  const first = month.toPlainDate({ day: 1 });
  const start = first.subtract({ days: columnIndex(first, weekStartsOn) });
  const weeks: Temporal.PlainDate[][] = [];
  let cursor = start;
  for (let w = 0; w < 6; w++) {
    const row: Temporal.PlainDate[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(cursor);
      cursor = cursor.add({ days: 1 });
    }
    weeks.push(row);
  }
  return weeks;
}

// --- Inline icons (no external assets; inherit currentColor) ----------------

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
