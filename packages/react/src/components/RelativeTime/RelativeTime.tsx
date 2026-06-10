import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { formatRelative, toInstant, type InstantInput } from '../../utils/datetime';

export type RelativeTimeValue =
  | Temporal.PlainDate
  | Temporal.PlainDateTime
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | string;

export interface RelativeTimeProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * The point in time to describe. Accepts `Temporal.PlainDate`,
   * `Temporal.PlainDateTime`, `Temporal.ZonedDateTime`, `Temporal.Instant`,
   * or an ISO string.
   */
  value: RelativeTimeValue;
  /**
   * Reference instant (default: now at render / tick time).
   * Accepts the same union as `value`.
   */
  base?: RelativeTimeValue;
  /** BCP-47 locale string (default: system locale). */
  locale?: string;
  /**
   * `'auto'` emits "yesterday"/"今日" etc.; `'always'` always uses a number.
   * @default 'auto'
   */
  numeric?: 'auto' | 'always';
  /**
   * Re-render on a timer so "3分前" stays fresh.
   * @default false
   */
  live?: boolean;
  /**
   * How often to re-render in milliseconds when `live` is true.
   * Clamped to a minimum of 1000 ms (the finest displayed unit is seconds).
   * @default 30000
   */
  updateInterval?: number;
}

function isoString(value: RelativeTimeValue): string {
  if (typeof value === 'string') return value;
  return toInstant(value as InstantInput).toString();
}

/**
 * RelativeTime — renders a `<time>` element with human-readable relative text
 * such as "3分前" or "in 2 hours". Derived from `Intl.RelativeTimeFormat` and
 * the Temporal API — no `Date`, no string math.
 *
 * When `live` is true the component ticks on `updateInterval` (default 30 s)
 * so the displayed text stays current without a parent re-render.
 *
 * @example
 * ```tsx
 * <RelativeTime value={Temporal.Now.instant().subtract({ hours: 2 })} live />
 * <RelativeTime value="2026-01-01" locale="ja" numeric="always" />
 * ```
 */
export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  { value, base, locale, numeric = 'auto', live = false, updateInterval = 30_000, className, ...rest },
  ref,
) {
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!live) return;
    // Guard against `updateInterval <= 0`, which would make setInterval spin
    // as fast as the event loop allows. Sub-second ticks are pointless for
    // relative text anyway (the finest unit is seconds).
    const interval = Math.max(1000, updateInterval);
    intervalRef.current = setInterval(() => setTick((t) => t + 1), interval);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [live, updateInterval]);

  // Each setTick call triggers a re-render, which re-runs formatRelative with
  // a fresh Temporal.Now.instant() below — no stale closure issues.
  const now = base !== undefined ? (base as InstantInput) : Temporal.Now.instant();
  const text = formatRelative(value as InstantInput, now, locale, numeric);
  const iso = isoString(value);

  return (
    <time
      ref={ref}
      dateTime={iso}
      className={cx('lily-relative-time', className)}
      {...rest}
    >
      {text}
    </time>
  );
});
