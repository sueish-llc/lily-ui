import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import { getDateTimeFormat, toPlainYearMonth, toUtcDate, type PlainYearMonthInput } from '../../utils/datetime';
import { useControllableState, useDismiss } from '../../hooks';
import type { SizeToken } from '../../tokens';

const CLASS = 'lily-month-picker';

export interface MonthPickerProps {
  /** Selected month (controlled). Pass `null` for "no selection". */
  value?: Temporal.PlainYearMonth | null;
  /** Initial month (uncontrolled). @default null */
  defaultValue?: Temporal.PlainYearMonth | null;
  /** Called with the new month (or `null` when cleared). */
  onChange?: (value: Temporal.PlainYearMonth | null) => void;
  /** Earliest selectable month (inclusive). ISO `YYYY-MM` strings accepted. */
  min?: PlainYearMonthInput;
  /** Latest selectable month (inclusive). ISO `YYYY-MM` strings accepted. */
  max?: PlainYearMonthInput;
  /** BCP-47 locale for month names. Defaults to the host locale. */
  locale?: Intl.LocalesArgument;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Control size. @default 'md' */
  size?: Extract<SizeToken, 'sm' | 'md' | 'lg'>;
  /** Align the popup to the trigger's end (right) edge. @default false */
  alignEnd?: boolean;
  /** Accessible label for the trigger when no month is chosen. @default 'Choose month' */
  toggleLabel?: string;
  /** `id` for the trigger button (an auto-generated id is used otherwise). */
  id?: string;
  className?: string;
}

/** Coerce an optional `PlainYearMonthInput` to a `PlainYearMonth` (or `undefined`). */
function toBound(input: PlainYearMonthInput | undefined): Temporal.PlainYearMonth | undefined {
  return input == null ? undefined : toPlainYearMonth(input);
}

/** Localized month label via a fixed-UTC `Date`; the logic stays in Temporal. */
function formatMonth(
  ym: Temporal.PlainYearMonth,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): string {
  const utc = toUtcDate(ym.year, ym.month, 1);
  // Cached per locale + options: the grid formats 12+ labels on every render.
  return getDateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(utc);
}

/**
 * MonthPicker — pick a calendar month from a 12-month grid with prev/next year
 * navigation. The value is a **`Temporal.PlainYearMonth`** (this library models
 * all date/time with the Temporal API).
 *
 * Grid keyboard model (focus inside the panel):
 * - Arrow keys move by one / three months, `Home`/`End` to row edges
 * - `PageUp`/`PageDown` move by year
 * - `Enter`/`Space` selects, `Escape` closes
 *
 * @example
 * ```tsx
 * <MonthPicker
 *   defaultValue={Temporal.PlainYearMonth.from('2026-05')}
 *   onChange={setMonth}
 * />
 * ```
 */
export function MonthPicker({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  locale,
  disabled = false,
  size = 'md',
  alignEnd = false,
  toggleLabel = 'Choose month',
  id,
  className,
}: MonthPickerProps) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const popupId = `${baseId}-popup`;
  const titleId = `${baseId}-title`;

  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const focusCellRef = useRef(false);

  const minYm = useMemo(() => toBound(min), [min]);
  const maxYm = useMemo(() => toBound(max), [max]);

  const [selected, setSelected] = useControllableState<Temporal.PlainYearMonth | null>({
    value,
    defaultValue,
    onChange,
  });

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState<number>(() =>
    (selected ?? Temporal.Now.plainDateISO().toPlainYearMonth()).year,
  );
  const [focused, setFocused] = useState<Temporal.PlainYearMonth>(
    () => selected ?? clamp(Temporal.Now.plainDateISO().toPlainYearMonth(), minYm, maxYm),
  );

  function isSelectable(ym: Temporal.PlainYearMonth): boolean {
    if (minYm && Temporal.PlainYearMonth.compare(ym, minYm) < 0) return false;
    if (maxYm && Temporal.PlainYearMonth.compare(ym, maxYm) > 0) return false;
    return true;
  }

  function clampToBounds(ym: Temporal.PlainYearMonth): Temporal.PlainYearMonth {
    return clamp(ym, minYm, maxYm);
  }

  function moveFocus(ym: Temporal.PlainYearMonth) {
    const next = clampToBounds(ym);
    focusCellRef.current = true;
    setFocused(next);
    setViewYear(next.year);
  }

  function openPopup() {
    if (disabled) return;
    const start = clampToBounds(selected ?? Temporal.Now.plainDateISO().toPlainYearMonth());
    focusCellRef.current = true;
    setFocused(start);
    setViewYear(start.year);
    setOpen(true);
  }

  function closePopup(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }

  function selectMonth(ym: Temporal.PlainYearMonth) {
    if (!isSelectable(ym)) return;
    setSelected(ym);
    setFocused(ym);
    closePopup(true);
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
    if (!open || !focusCellRef.current) return;
    focusCellRef.current = false;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-month="${focused.toString()}"]`,
    );
    el?.focus();
  }, [open, focused, viewYear]);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => Temporal.PlainYearMonth.from({ year: viewYear, month: i + 1 })),
    [viewYear],
  );

  const prevDisabled =
    minYm != null && viewYear <= minYm.year;
  const nextDisabled =
    maxYm != null && viewYear >= maxYm.year;

  function onGridKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowLeft':
        moveFocus(focused.subtract({ months: 1 }));
        break;
      case 'ArrowRight':
        moveFocus(focused.add({ months: 1 }));
        break;
      case 'ArrowUp':
        moveFocus(focused.subtract({ months: 3 }));
        break;
      case 'ArrowDown':
        moveFocus(focused.add({ months: 3 }));
        break;
      case 'Home':
        moveFocus(focused.subtract({ months: (focused.month - 1) % 3 }));
        break;
      case 'End':
        moveFocus(focused.add({ months: 2 - ((focused.month - 1) % 3) }));
        break;
      case 'PageUp':
        moveFocus(focused.subtract({ years: 1 }));
        break;
      case 'PageDown':
        moveFocus(focused.add({ years: 1 }));
        break;
      case 'Enter':
      case ' ':
        selectMonth(focused);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  const triggerText = selected
    ? formatMonth(selected, locale, { year: 'numeric', month: 'long' })
    : toggleLabel;

  return (
    <div
      ref={rootRef}
      className={cx(
        CLASS,
        `${CLASS}--${size}`,
        disabled && `${CLASS}--disabled`,
        className,
      )}
    >
      <button
        ref={toggleRef}
        type="button"
        id={baseId}
        className={`${CLASS}__trigger`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        aria-label={selected ? `${toggleLabel}: ${triggerText}` : toggleLabel}
        disabled={disabled}
        onClick={() => (open ? closePopup(false) : openPopup())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openPopup();
          }
        }}
      >
        <span className={cx(`${CLASS}__value`, !selected && `${CLASS}__value--placeholder`)}>
          {triggerText}
        </span>
        <span className={`${CLASS}__icon`}>
          <CalendarIcon />
        </span>
      </button>

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
              aria-label="Previous year"
              disabled={prevDisabled}
              onClick={() => setViewYear((y) => y - 1)}
            >
              <ChevronIcon dir="left" />
            </button>
            <h2 id={titleId} className={`${CLASS}__title`} aria-live="polite">
              {viewYear}
            </h2>
            <button
              type="button"
              className={`${CLASS}__nav`}
              aria-label="Next year"
              disabled={nextDisabled}
              onClick={() => setViewYear((y) => y + 1)}
            >
              <ChevronIcon dir="right" />
            </button>
          </div>

          <div
            ref={gridRef}
            role="group"
            aria-labelledby={titleId}
            className={`${CLASS}__grid`}
          >
            {months.map((ym) => {
              const isSelected = selected != null && ym.equals(selected);
              const isFocused = ym.equals(focused);
              const selectable = isSelectable(ym);
              return (
                <button
                  key={ym.toString()}
                  type="button"
                  data-month={ym.toString()}
                  className={cx(`${CLASS}__month`, {
                    [`${CLASS}__month--selected`]: isSelected,
                  })}
                  tabIndex={isFocused ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-disabled={!selectable || undefined}
                  aria-label={formatMonth(ym, locale, { year: 'numeric', month: 'long' })}
                  onClick={() => selectMonth(ym)}
                  onKeyDown={onGridKeyDown}
                  onFocus={() => setFocused(ym)}
                >
                  {formatMonth(ym, locale, { month: 'short' })}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Pure helpers (Temporal) -----------------------------------------------

/** Clamp `ym` into the inclusive `[min, max]` range. */
function clamp(
  ym: Temporal.PlainYearMonth,
  min: Temporal.PlainYearMonth | undefined,
  max: Temporal.PlainYearMonth | undefined,
): Temporal.PlainYearMonth {
  if (min && Temporal.PlainYearMonth.compare(ym, min) < 0) return min;
  if (max && Temporal.PlainYearMonth.compare(ym, max) > 0) return max;
  return ym;
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
