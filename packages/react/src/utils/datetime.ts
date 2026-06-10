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
 * Module-level cache for {@link getDateTimeFormat}. `Intl.DateTimeFormat`
 * construction is expensive (locale data lookup), and date components format
 * dozens of labels per render — reusing one formatter per locale + options
 * combination keeps renders (and arrow-key navigation) cheap.
 */
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Cache key fragment for an `Intl.LocalesArgument`. `Intl.Locale` objects have
 * no enumerable own properties, so `JSON.stringify` would collapse them all to
 * `"{}"` and collide across locales — `String(locale)` (the BCP-47 tag) is the
 * faithful key.
 */
function localeKey(locale: Intl.LocalesArgument): string {
  return Array.isArray(locale) ? locale.map(String).join(',') : String(locale ?? '');
}

/** A cached `Intl.DateTimeFormat` for the given locale + options combination. */
export function getDateTimeFormat(
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions = {},
): Intl.DateTimeFormat {
  const key = `${localeKey(locale)}|${JSON.stringify(options)}`;
  let format = dateTimeFormatCache.get(key);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, options);
    dateTimeFormatCache.set(key, format);
  }
  return format;
}

/**
 * A legacy `Date` at UTC midnight for the given calendar fields, for the sole
 * purpose of feeding `Intl.DateTimeFormat` (which only accepts `Date`).
 * Built via `setUTCFullYear` because the `Date.UTC(year, …)` shortcut
 * reinterprets years 0–99 as 1900–1999. All date *logic* stays in Temporal.
 */
export function toUtcDate(year: number, month: number, day: number): Date {
  // new Date(0) is exactly 1970-01-01T00:00:00Z, so only Y/M/D need setting.
  const utc = new Date(0);
  utc.setUTCFullYear(year, month - 1, day);
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
    // Try ZonedDateTime first (contains timezone), then Instant (trailing Z),
    // then PlainDateTime (no timezone info — treated as UTC).
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
  // PlainDate
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
 * Module-level cache for `Intl.RelativeTimeFormat` instances. Like
 * `Intl.DateTimeFormat`, construction is expensive (locale data lookup), and
 * live "relative time" labels re-format on a timer — reuse one formatter per
 * locale + numeric combination.
 */
const relativeTimeFormatCache = new Map<string, Intl.RelativeTimeFormat>();

/** A cached `Intl.RelativeTimeFormat` for the given locale + numeric combination. */
function getRelativeTimeFormat(
  locale: string | undefined,
  numeric: 'auto' | 'always',
): Intl.RelativeTimeFormat {
  const key = `${locale ?? ''}|${numeric}`;
  let format = relativeTimeFormatCache.get(key);
  if (!format) {
    format = new Intl.RelativeTimeFormat(locale, { numeric, style: 'long' });
    relativeTimeFormatCache.set(key, format);
  }
  return format;
}

/**
 * Format the duration from `base` to `value` as a human-readable relative
 * string (e.g. "3分前", "in 2 hours"). Uses `Intl.RelativeTimeFormat` with the
 * largest unit whose absolute value is at least one, or seconds as a fallback.
 *
 * @param value - The point in time to describe.
 * @param base  - Reference instant (default: `Temporal.Now.instant()`).
 * @param locale - BCP-47 locale string (default: system locale).
 * @param numeric - `'auto'` emits "yesterday"/"今日" etc.; `'always'` always
 *   uses a number. @default 'auto'
 */
export function formatRelative(
  value: InstantInput,
  base: InstantInput = Temporal.Now.instant(),
  locale?: string,
  numeric: 'auto' | 'always' = 'auto',
): string {
  const vInst = toInstant(value);
  const bInst = toInstant(base);
  // Total seconds between base and value (positive → value is in the future).
  const totalSeconds = bInst.until(vInst, { largestUnit: 'second' }).seconds;
  const abs = Math.abs(totalSeconds);
  const rtf = getRelativeTimeFormat(locale, numeric);
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
 *
 * @param target - Target instant.
 * @param now    - Current instant (default: `Temporal.Now.instant()`).
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
