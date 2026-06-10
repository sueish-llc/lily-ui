import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { remainingDuration, type InstantInput } from '../../utils/datetime';

export type CountdownFormat = 'dhms' | 'hms';

export interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Target date/time. Accepts `Temporal.PlainDateTime`, `Temporal.ZonedDateTime`,
   * or an ISO string. When the target is in the past the display reads all zeros.
   */
  to: Temporal.PlainDateTime | Temporal.ZonedDateTime | string;
  /**
   * Called once when the countdown reaches zero.
   */
  onComplete?: () => void;
  /**
   * Which segments to show.
   * `'dhms'` shows days + hours + minutes + seconds.
   * `'hms'` shows hours (including overflow from days) + minutes + seconds.
   * @default 'dhms'
   */
  format?: CountdownFormat;
  /**
   * Whether to tick each second.
   * @default true
   */
  live?: boolean;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function calcSegments(
  to: Temporal.PlainDateTime | Temporal.ZonedDateTime | string,
  format: CountdownFormat,
): { days: number; hours: number; minutes: number; seconds: number } {
  // An unparsable `to` displays all zeros instead of throwing — the same
  // behavior as the Web Components port (see Countdown.ts `_segments`).
  try {
    const dur = remainingDuration(to as InstantInput);
    const d = dur.days;
    const h = dur.hours;
    const m = dur.minutes;
    const s = dur.seconds;

    if (format === 'hms') {
      return { days: 0, hours: d * 24 + h, minutes: m, seconds: s };
    }
    return { days: d, hours: h, minutes: m, seconds: s };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
}

/**
 * Countdown — displays the remaining time to a target instant as
 * days / hours / minutes / seconds segments. Ticks each second when `live`
 * (the default). Uses the Temporal API throughout — no `Date`, no arithmetic
 * on millisecond offsets.
 *
 * Each segment is a labelled `<span>` so meaning is never color-only, and the
 * root carries `role="timer"` with `aria-live="off"` (a live-region with
 * assertive updates would be unbearably noisy for a per-second ticker).
 *
 * @example
 * ```tsx
 * <Countdown to={Temporal.PlainDateTime.from('2027-01-01T00:00:00')} onComplete={() => alert('done')} />
 * <Countdown to="2027-12-31T23:59:59" format="hms" />
 * ```
 */
export const Countdown = forwardRef<HTMLDivElement, CountdownProps>(function Countdown(
  { to, onComplete, format = 'dhms', live = true, className, ...rest },
  ref,
) {
  const [segments, setSegments] = useState(() => calcSegments(to, format));
  const completedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recalculate whenever `to` or `format` change (even when not live).
  useEffect(() => {
    setSegments(calcSegments(to, format));
    completedRef.current = false;
  }, [to, format]);

  useEffect(() => {
    if (!live) return;

    const tick = () => {
      const next = calcSegments(to, format);
      setSegments(next);
      const done =
        next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0;
      if (done && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
      }
    };

    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [to, format, live, onComplete]);

  const { days, hours, minutes, seconds } = segments;
  const showDays = format === 'dhms';

  return (
    <div
      ref={ref}
      role="timer"
      aria-live="off"
      className={cx('lily-countdown', className)}
      {...rest}
    >
      {showDays && (
        <span className="lily-countdown__segment">
          <span className="lily-countdown__value">{pad2(days)}</span>
          <span className="lily-countdown__label">d</span>
        </span>
      )}
      <span className="lily-countdown__segment">
        <span className="lily-countdown__value">{pad2(hours)}</span>
        <span className="lily-countdown__label">h</span>
      </span>
      <span className="lily-countdown__segment">
        <span className="lily-countdown__value">{pad2(minutes)}</span>
        <span className="lily-countdown__label">m</span>
      </span>
      <span className="lily-countdown__segment">
        <span className="lily-countdown__value">{pad2(seconds)}</span>
        <span className="lily-countdown__label">s</span>
      </span>
    </div>
  );
});
