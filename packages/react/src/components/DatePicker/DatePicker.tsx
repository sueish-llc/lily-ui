import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import {
  getDateTimeFormat,
  today,
  toPlainDate,
  toUtcDate,
  type PlainDateInput,
} from '../../utils/datetime';
import { useControllableState, useDismiss } from '../../hooks';

const CLASS = 'lily-datepicker';

/** Day-of-week the calendar grid starts on: 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DatePickerProps {
  /** Selected date (controlled). Pass `null` for "no selection". */
  value?: Temporal.PlainDate | null;
  /** Initial selected date (uncontrolled). @default null */
  defaultValue?: Temporal.PlainDate | null;
  /** Called with the new date (or `null` when cleared). */
  onChange?: (date: Temporal.PlainDate | null) => void;
  /** Earliest selectable date (inclusive). ISO `YYYY-MM-DD` strings accepted. */
  min?: PlainDateInput;
  /** Latest selectable date (inclusive). ISO `YYYY-MM-DD` strings accepted. */
  max?: PlainDateInput;
  /** Disable individual dates (e.g. weekends, holidays). */
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;
  /** BCP-47 locale for month / weekday names. Defaults to the host locale. */
  locale?: Intl.LocalesArgument;
  /** Which weekday the grid starts on. @default 1 (Monday) */
  weekStartsOn?: Weekday;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Mark the field as invalid (combined with internal parse errors). */
  invalid?: boolean;
  /** Align the calendar popup to the field's end (right) edge. @default false */
  alignEnd?: boolean;
  /** Placeholder for the text field. @default 'YYYY-MM-DD' */
  placeholder?: string;
  /** Accessible label for the calendar toggle button. @default 'Choose date' */
  toggleLabel?: string;
  /** `id` for the text input (an auto-generated id is used otherwise). */
  id?: string;
  /** `name` for the text input, for form submission. */
  name?: string;
  /** Mark the field as required. */
  required?: boolean;
  /** Extra props forwarded to the text `<input>`. */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'disabled' | 'required' | 'name' | 'id'
  >;
  className?: string;
}

/**
 * Coerce an optional `PlainDateInput` to a `PlainDate` (or `undefined`).
 * Like the text-field value, bounds are parsed defensively: an invalid ISO
 * string is ignored (no bound) instead of throwing during render.
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
 * Format a `Temporal.PlainDate` for display via `Intl.DateTimeFormat`.
 *
 * We format through a fixed-UTC `Date` rather than `PlainDate.toLocaleString`
 * because option support for the latter still varies across engines (notably,
 * some runtimes ignore `month`/`weekday` styles). Going through `Intl` directly
 * gives identical, correct labels in every browser. All date *logic* stays in
 * Temporal — only the human-readable label is produced here.
 */
function formatPlain(
  date: Temporal.PlainDate,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  const utc = toUtcDate(date.year, date.month, date.day);
  // Cached per locale + options: a month view formats ~50 labels per render,
  // and recreating the formatters on every arrow-key move is needless work.
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(utc);
}

/**
 * An accessible, Temporal-powered date picker: a text field (ISO `YYYY-MM-DD`)
 * paired with a keyboard-navigable calendar popup.
 *
 * The calendar is rendered from plain elements and CSS — no native
 * `<input type="date">` — so its appearance and keyboard model are identical
 * across browsers, including Firefox. All date arithmetic uses the standard
 * `Temporal` API (native on Node 26; polyfilled elsewhere).
 *
 * Calendar keyboard model (focus inside the grid):
 * - Arrow keys move by day / week, `Home`/`End` to week edges
 * - `PageUp`/`PageDown` move by month (hold `Shift` for years)
 * - `Enter`/`Space` selects, `Escape` closes
 */
export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  isDateDisabled,
  locale,
  weekStartsOn = 1,
  disabled = false,
  invalid = false,
  alignEnd = false,
  placeholder = 'YYYY-MM-DD',
  toggleLabel = 'Choose date',
  id,
  name,
  required,
  inputProps,
  className,
}: DatePickerProps) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const popupId = `${baseId}-popup`;
  const titleId = `${baseId}-title`;

  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  // When true, the next focusedDate change should move DOM focus into the grid
  // (keyboard navigation / opening) rather than leaving it on a nav button.
  const focusDayRef = useRef(false);

  const minDate = useMemo(() => toBound(min), [min]);
  const maxDate = useMemo(() => toBound(max), [max]);

  const [selected, setSelected] = useControllableState<Temporal.PlainDate | null>({
    value,
    defaultValue,
    onChange,
  });

  const [open, setOpen] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [text, setText] = useState(() => (selected ? selected.toString() : ''));
  const [todayDate, setTodayDate] = useState(() => today());
  const [focusedDate, setFocusedDate] = useState<Temporal.PlainDate>(
    () => selected ?? clamp(todayDate, minDate, maxDate),
  );

  // Keep the text field in sync when the value changes from the outside (or via
  // the calendar). Keyed on the ISO string so a re-created PlainDate instance
  // for the same day doesn't clobber what the user is typing.
  const selectedIso = selected ? selected.toString() : '';
  useEffect(() => {
    setText(selectedIso);
    setParseError(false);
  }, [selectedIso]);

  function clampToBounds(date: Temporal.PlainDate): Temporal.PlainDate {
    return clamp(date, minDate, maxDate);
  }

  function isSelectable(date: Temporal.PlainDate): boolean {
    if (minDate && Temporal.PlainDate.compare(date, minDate) < 0) return false;
    if (maxDate && Temporal.PlainDate.compare(date, maxDate) > 0) return false;
    return !isDateDisabled?.(date);
  }

  function moveFocus(date: Temporal.PlainDate) {
    focusDayRef.current = true;
    setFocusedDate(clampToBounds(date));
  }

  function openPopup() {
    if (disabled) return;
    const now = today();
    setTodayDate(now);
    focusDayRef.current = true;
    setFocusedDate(clampToBounds(selected ?? now));
    setOpen(true);
  }

  function closePopup(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }

  function selectDate(date: Temporal.PlainDate) {
    if (!isSelectable(date)) return;
    setSelected(date);
    setFocusedDate(date);
    setParseError(false);
    closePopup(true);
  }

  function commitText() {
    const trimmed = text.trim();
    if (trimmed === '') {
      setSelected(null);
      setParseError(false);
      return;
    }
    let parsed: Temporal.PlainDate | null = null;
    try {
      parsed = Temporal.PlainDate.from(trimmed, { overflow: 'reject' });
    } catch {
      parsed = null;
    }
    if (parsed && isSelectable(parsed)) {
      setSelected(parsed);
      setFocusedDate(parsed);
      setParseError(false);
    } else {
      setParseError(true);
    }
  }

  // Close on outside click; Escape is handled separately so we can restore
  // focus to the toggle (the WAI-ARIA dialog expectation).
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

  // Move DOM focus to the active day when navigating with the keyboard.
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
    minDate != null &&
    Temporal.PlainYearMonth.compare(viewMonth, minDate.toPlainYearMonth()) <= 0;
  const nextDisabled =
    maxDate != null &&
    Temporal.PlainYearMonth.compare(viewMonth, maxDate.toPlainYearMonth()) >= 0;

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

  return (
    <div
      ref={rootRef}
      className={cx(
        CLASS,
        (invalid || parseError) && `${CLASS}--invalid`,
        disabled && `${CLASS}--disabled`,
        className,
      )}
    >
      <div className={`${CLASS}__field`}>
        <input
          {...inputProps}
          id={baseId}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className={`${CLASS}__input`}
          placeholder={placeholder}
          value={text}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || parseError || undefined}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => {
            commitText();
            inputProps?.onBlur?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitText();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              openPopup();
            }
            inputProps?.onKeyDown?.(e);
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
              onClick={() => setFocusedDate(clampToBounds(focusedDate.subtract({ months: 1 })))}
            >
              <ChevronIcon dir="left" />
            </button>
            <h2 id={titleId} className={`${CLASS}__title`} aria-live="polite">
              {formatPlain(focusedDate, locale, { year: 'numeric', month: 'long' })}
            </h2>
            <button
              type="button"
              className={`${CLASS}__nav`}
              aria-label="Next month"
              disabled={nextDisabled}
              onClick={() => setFocusedDate(clampToBounds(focusedDate.add({ months: 1 })))}
            >
              <ChevronIcon dir="right" />
            </button>
          </div>

          <table ref={gridRef} className={`${CLASS}__grid`} aria-labelledby={titleId}>
            <thead>
              <tr>
                {headerRow.map((d) => (
                  <th key={d.toString()} scope="col" className={`${CLASS}__weekday`}>
                    <abbr title={formatPlain(d, locale, { weekday: 'long' })}>
                      {formatPlain(d, locale, { weekday: 'short' })}
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
                    const isSelected = selected != null && date.equals(selected);
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
                          aria-label={formatPlain(date, locale, {
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
        </div>
      )}
    </div>
  );
}

// --- Pure date helpers (Temporal) ------------------------------------------

/** Clamp `date` into the inclusive `[min, max]` range. */
function clamp(
  date: Temporal.PlainDate,
  min: Temporal.PlainDate | undefined,
  max: Temporal.PlainDate | undefined,
): Temporal.PlainDate {
  if (min && Temporal.PlainDate.compare(date, min) < 0) return min;
  if (max && Temporal.PlainDate.compare(date, max) > 0) return max;
  return date;
}

/** Column (0-6) of `date` within a week starting on `weekStartsOn`. */
function columnIndex(date: Temporal.PlainDate, weekStartsOn: Weekday): number {
  // Temporal dayOfWeek is 1 (Mon) … 7 (Sun); `% 7` gives JS-style 0 (Sun) … 6.
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
