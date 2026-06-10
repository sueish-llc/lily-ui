import { forwardRef, useId, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface DurationInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value. `null` represents an empty / unset duration. */
  value?: Temporal.Duration | null;
  /** Initial value when uncontrolled. @default null */
  defaultValue?: Temporal.Duration | null;
  /** Called with the new `Temporal.Duration` (or `null` when all fields are empty). */
  onChange?: (value: Temporal.Duration | null) => void;
  /** Show a seconds field in addition to hours and minutes. @default false */
  withSeconds?: boolean;
  /** Disable all fields. @default false */
  disabled?: boolean;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Status modifier. */
  status?: 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
  /** Native `name` forwarded to a hidden serialization input. */
  name?: string;
  /** `id` applied to the wrapping group element. */
  id?: string;
  /** Accessible label for the hours field. @default 'Hours' */
  hoursLabel?: string;
  /** Accessible label for the minutes field. @default 'Minutes' */
  minutesLabel?: string;
  /** Accessible label for the seconds field. @default 'Seconds' */
  secondsLabel?: string;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function clampField(n: number, max: number): number {
  return Math.max(0, Math.min(max, Math.floor(n)));
}

function fromParts(
  hours: number | null,
  minutes: number | null,
  seconds: number | null,
): Temporal.Duration | null {
  if (hours === null && minutes === null && seconds === null) return null;
  return Temporal.Duration.from({
    hours: hours ?? 0,
    minutes: minutes ?? 0,
    seconds: seconds ?? 0,
  });
}

/**
 * DurationInput — numeric fields for hours, minutes, and (optionally) seconds,
 * backed by `Temporal.Duration`. Each field is a real `<input type="number">`
 * so keyboard and screen-reader users can operate them without restriction.
 * Builds on the existing number-input markup and tokens.
 *
 * @example
 * ```tsx
 * <DurationInput defaultValue={Temporal.Duration.from({ hours: 1, minutes: 30 })} onChange={setDur} />
 * <DurationInput withSeconds value={dur} onChange={setDur} disabled />
 * ```
 */
export const DurationInput = forwardRef<HTMLDivElement, DurationInputProps>(function DurationInput(
  {
    value: valueProp,
    defaultValue = null,
    onChange,
    withSeconds = false,
    disabled = false,
    size = 'md',
    status,
    name,
    id,
    hoursLabel = 'Hours',
    minutesLabel = 'Minutes',
    secondsLabel = 'Seconds',
    className,
    ...rest
  },
  ref,
) {
  const [dur, setDur] = useControllableState<Temporal.Duration | null>({
    value: valueProp,
    defaultValue,
    onChange,
  });

  const h = dur ? dur.hours : null;
  const m = dur ? dur.minutes : null;
  const s = dur ? dur.seconds : null;

  const uid = useId();
  const hourId = `${uid}-h`;
  const minId = `${uid}-m`;
  const secId = `${uid}-s`;

  const setH = (v: number | null) => setDur(fromParts(v, m, withSeconds ? s : null));
  const setM = (v: number | null) => setDur(fromParts(h, v, withSeconds ? s : null));
  const setS = (v: number | null) => setDur(fromParts(h, m, v));

  const rootClasses = cx(
    'lily-duration-input',
    size !== 'md' && `lily-duration-input--${size}`,
    status && `lily-duration-input--${status}`,
    className,
  );

  const fieldClasses = cx(
    'lily-number-input',
    size !== 'md' && `lily-number-input--${size}`,
  );

  const hiddenValue =
    dur
      ? `PT${dur.hours}H${dur.minutes}M${dur.seconds}S`
      : '';

  return (
    <div ref={ref} id={id} className={rootClasses} {...rest}>
      {name && <input type="hidden" name={name} value={hiddenValue} />}

      {/* Hours */}
      <div className="lily-duration-input__field-group">
        <label htmlFor={hourId} className="lily-duration-input__label">
          {hoursLabel}
        </label>
        <div className={fieldClasses}>
          <button
            type="button"
            className="lily-number-input__btn"
            aria-label="Decrease hours"
            disabled={disabled || h === 0}
            onClick={() => setH(clampField((h ?? 0) - 1, 999))}
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            id={hourId}
            type="number"
            className="lily-number-input__field"
            inputMode="numeric"
            min={0}
            max={999}
            disabled={disabled}
            value={h !== null ? pad2(h) : ''}
            aria-label={hoursLabel}
            onChange={(e) => {
              const raw = e.target.value;
              setH(raw === '' ? null : clampField(Number(raw), 999));
            }}
          />
          <button
            type="button"
            className="lily-number-input__btn"
            aria-label="Increase hours"
            disabled={disabled || h === 999}
            onClick={() => setH(clampField((h ?? 0) + 1, 999))}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      <span className="lily-duration-input__sep" aria-hidden="true">:</span>

      {/* Minutes */}
      <div className="lily-duration-input__field-group">
        <label htmlFor={minId} className="lily-duration-input__label">
          {minutesLabel}
        </label>
        <div className={fieldClasses}>
          <button
            type="button"
            className="lily-number-input__btn"
            aria-label="Decrease minutes"
            disabled={disabled || m === 0}
            onClick={() => setM(clampField((m ?? 0) - 1, 59))}
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            id={minId}
            type="number"
            className="lily-number-input__field"
            inputMode="numeric"
            min={0}
            max={59}
            disabled={disabled}
            value={m !== null ? pad2(m) : ''}
            aria-label={minutesLabel}
            onChange={(e) => {
              const raw = e.target.value;
              setM(raw === '' ? null : clampField(Number(raw), 59));
            }}
          />
          <button
            type="button"
            className="lily-number-input__btn"
            aria-label="Increase minutes"
            disabled={disabled || m === 59}
            onClick={() => setM(clampField((m ?? 0) + 1, 59))}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      {/* Seconds */}
      {withSeconds && (
        <>
          <span className="lily-duration-input__sep" aria-hidden="true">:</span>
          <div className="lily-duration-input__field-group">
            <label htmlFor={secId} className="lily-duration-input__label">
              {secondsLabel}
            </label>
            <div className={fieldClasses}>
              <button
                type="button"
                className="lily-number-input__btn"
                aria-label="Decrease seconds"
                disabled={disabled || s === 0}
                onClick={() => setS(clampField((s ?? 0) - 1, 59))}
              >
                <span aria-hidden="true">−</span>
              </button>
              <input
                id={secId}
                type="number"
                className="lily-number-input__field"
                inputMode="numeric"
                min={0}
                max={59}
                disabled={disabled}
                value={s !== null ? pad2(s) : ''}
                aria-label={secondsLabel}
                onChange={(e) => {
                  const raw = e.target.value;
                  setS(raw === '' ? null : clampField(Number(raw), 59));
                }}
              />
              <button
                type="button"
                className="lily-number-input__btn"
                aria-label="Increase seconds"
                disabled={disabled || s === 59}
                onClick={() => setS(clampField((s ?? 0) + 1, 59))}
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
