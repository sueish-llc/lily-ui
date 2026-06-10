/**
 * Date helpers built on the standard **Temporal API** (`Temporal.PlainDate`,
 * `Temporal.Now`, …).
 *
 * Temporal is a native global on Node 26 — the project's primary target — and
 * other runtimes load a polyfill (see the README). These helpers work with
 * *plain calendar dates* (no clock time, no time zone): the right model for UI
 * concerns like "due date" or "published on", and one that sidesteps the
 * time-zone foot-guns of the legacy `Date` object.
 *
 * @example
 * formatDate(addDays(today(), 7), 'ja-JP', { dateStyle: 'long' });
 */

/** A `Temporal.PlainDate`, or an ISO `YYYY-MM-DD` string to parse into one. */
export type PlainDateInput = Temporal.PlainDate | string;

/** Coerce a value to a `Temporal.PlainDate` (ISO `YYYY-MM-DD` strings accepted). */
export function toPlainDate(input: PlainDateInput): Temporal.PlainDate {
  return typeof input === 'string' ? Temporal.PlainDate.from(input) : input;
}

/** Today's calendar date in the given IANA time zone (system zone by default). */
export function today(timeZone?: string): Temporal.PlainDate {
  return Temporal.Now.plainDateISO(timeZone);
}

/** Add — or, with a negative `days`, subtract — whole calendar days. */
export function addDays(date: PlainDateInput, days: number): Temporal.PlainDate {
  return toPlainDate(date).add({ days });
}

/** Whole days from `from` to `to` (negative when `to` precedes `from`). */
export function diffInDays(from: PlainDateInput, to: PlainDateInput): number {
  return toPlainDate(from).until(toPlainDate(to), { largestUnit: 'day' }).days;
}

/** Whether `date` is the same calendar day as today (system zone by default). */
export function isToday(date: PlainDateInput, timeZone?: string): boolean {
  return toPlainDate(date).equals(today(timeZone));
}

/** Localized, human-readable date string (defaults to the host locale). */
export function formatDate(
  date: PlainDateInput,
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
): string {
  return toPlainDate(date).toLocaleString(locales, options);
}

/**
 * `Intl.DateTimeFormat` instances cached per locale + options. Constructing a
 * formatter is expensive (locale data lookup), and calendar renders ask for the
 * same handful of formats dozens of times per frame — reuse them instead.
 */
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

/** A cached `Intl.DateTimeFormat` for the given locale(s) and options. */
export function getDateTimeFormat(
  locales: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  // `String(locale)` (BCP-47 tag) rather than `JSON.stringify`: an
  // `Intl.Locale` object stringifies to `"{}"` via JSON, which would collide
  // across different locales. Mirrors the Vue package's implementation.
  const localeKey = Array.isArray(locales)
    ? locales.map(String).join(',')
    : String(locales ?? '');
  const key = `${localeKey}|${JSON.stringify(options)}`;
  let fmt = dateTimeFormatCache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locales, options);
    dateTimeFormatCache.set(key, fmt);
  }
  return fmt;
}

/**
 * A fixed-UTC `Date` at midnight of `date`, used only to feed
 * `Intl.DateTimeFormat` (all date *logic* stays in Temporal).
 *
 * Built via `setUTCFullYear` on the epoch because the `Date.UTC(year, …)`
 * shortcut reinterprets years 0-99 as 1900-1999 (and a leap day like
 * 0000-02-29 would roll over before the year correction), matching the
 * React/Vue helpers.
 */
export function toUTCDate(date: Temporal.PlainDate): Date {
  // new Date(0) is exactly 1970-01-01T00:00:00Z, so only Y/M/D need setting.
  const utc = new Date(0);
  utc.setUTCFullYear(date.year, date.month - 1, date.day);
  return utc;
}

/** A `Temporal.PlainDateTime`, or an ISO datetime string to parse into one. */
export type PlainDateTimeInput = Temporal.PlainDateTime | string;

/** Coerce a value to a `Temporal.PlainDateTime` (ISO strings accepted). */
export function toPlainDateTime(input: PlainDateTimeInput): Temporal.PlainDateTime {
  return typeof input === 'string' ? Temporal.PlainDateTime.from(input) : input;
}

/** A `Temporal.PlainYearMonth`, or an ISO `YYYY-MM` string to parse into one. */
export type PlainYearMonthInput = Temporal.PlainYearMonth | string;

/** Coerce a value to a `Temporal.PlainYearMonth` (ISO `YYYY-MM` strings accepted). */
export function toPlainYearMonth(input: PlainYearMonthInput): Temporal.PlainYearMonth {
  return typeof input === 'string' ? Temporal.PlainYearMonth.from(input) : input;
}

// =============================================================================
// Relative-time helpers
// =============================================================================

/**
 * A value accepted by {@link toInstant}: a `Temporal.Instant`, a
 * `Temporal.ZonedDateTime`, a `Temporal.PlainDateTime` (treated as UTC),
 * a `Temporal.PlainDate` (treated as UTC midnight), or an ISO string.
 */
export type InstantInput =
  | Temporal.Instant
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | string;

/** Coerce any supported value to a `Temporal.Instant`. */
export function toInstant(input: InstantInput): Temporal.Instant {
  if (typeof input === 'string') {
    try {
      return Temporal.Instant.from(input);
    } catch {
      try {
        return Temporal.PlainDateTime.from(input).toZonedDateTime('UTC').toInstant();
      } catch {
        return Temporal.PlainDate.from(input).toZonedDateTime('UTC').toInstant();
      }
    }
  }
  if (input instanceof Temporal.Instant) return input;
  if (input instanceof Temporal.ZonedDateTime) return input.toInstant();
  if (input instanceof Temporal.PlainDateTime) return input.toZonedDateTime('UTC').toInstant();
  return (input as Temporal.PlainDate).toZonedDateTime('UTC').toInstant();
}

/** [unit, seconds] thresholds tried in decreasing magnitude for {@link formatRelative}. */
const REL_THRESHOLDS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
];

/**
 * `Intl.RelativeTimeFormat` instances cached per locale + options — the same
 * rationale as {@link getDateTimeFormat} (constructing one is expensive, and a
 * live `<lily-relative-time>` asks for the same formatter on every tick).
 */
const relativeTimeFormatCache = new Map<string, Intl.RelativeTimeFormat>();

function getRelativeTimeFormat(
  locale: string | undefined,
  options: Intl.RelativeTimeFormatOptions,
): Intl.RelativeTimeFormat {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`;
  let fmt = relativeTimeFormatCache.get(key);
  if (!fmt) {
    fmt = new Intl.RelativeTimeFormat(locale, options);
    relativeTimeFormatCache.set(key, fmt);
  }
  return fmt;
}

/**
 * Format the duration from `base` to `value` as a human-readable relative
 * string. Uses `Intl.RelativeTimeFormat` with the largest unit whose absolute
 * value is at least one, or seconds as a fallback.
 */
export function formatRelative(
  value: InstantInput,
  base: InstantInput = Temporal.Now.instant(),
  locale?: string,
  numeric: 'auto' | 'always' = 'auto',
): string {
  const vInst = toInstant(value);
  const bInst = toInstant(base);
  const totalSeconds = bInst.until(vInst, { largestUnit: 'second' }).seconds;
  const abs = Math.abs(totalSeconds);
  const rtf = getRelativeTimeFormat(locale, { numeric, style: 'long' });
  for (const [unit, threshold] of REL_THRESHOLDS) {
    if (abs >= threshold) {
      return rtf.format(Math.round(totalSeconds / threshold), unit);
    }
  }
  return rtf.format(Math.round(totalSeconds), 'second');
}

/**
 * Remaining `Temporal.Duration` from `now` to `target`, clamped to zero.
 *
 * Instants carry no calendar, so the result is balanced from a fixed-length
 * seconds duration: days and below are unambiguous, while weeks and larger
 * would need a reference date.
 */
export function remainingDuration(
  target: InstantInput,
  now: InstantInput = Temporal.Now.instant(),
): Temporal.Duration {
  const tInst = toInstant(target);
  const nInst = toInstant(now);
  if (Temporal.Instant.compare(tInst, nInst) <= 0) {
    return Temporal.Duration.from({ seconds: 0 });
  }
  const totalSeconds = nInst.until(tInst, { largestUnit: 'second' }).seconds;
  return Temporal.Duration.from({ seconds: totalSeconds }).round({
    largestUnit: 'day',
    smallestUnit: 'second',
  });
}
