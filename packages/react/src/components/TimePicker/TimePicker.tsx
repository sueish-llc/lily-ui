import { forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

const pad2 = (n: number) => String(n).padStart(2, '0');

export interface TimePickerProps {
  /** Controlled time (a `Temporal.PlainTime`), or `null`. */
  value?: Temporal.PlainTime | null;
  /** Initial time when uncontrolled. @default null */
  defaultValue?: Temporal.PlainTime | null;
  /** Called with the new `Temporal.PlainTime` (or `null`). */
  onChange?: (value: Temporal.PlainTime | null) => void;
  /** Minute increment. @default 5 */
  minuteStep?: number;
  /** Use 12-hour display with an AM/PM select. @default false */
  hour12?: boolean;
  /** Disable the control. @default false */
  disabled?: boolean;
  /** Accessible label for the hour select. @default 'Hour' */
  hourLabel?: string;
  /** Accessible label for the minute select. @default 'Minute' */
  minuteLabel?: string;
  /** Accessible label for the AM/PM select. @default 'AM/PM' */
  meridiemLabel?: string;
  id?: string;
  className?: string;
}

/**
 * TimePicker — pick a time of day from hour/minute (and optional AM/PM) selects.
 * The value is a **`Temporal.PlainTime`** (this library models all date/time
 * with the Temporal API). Built on native `<select>`s, fully keyboard
 * accessible with no popup.
 *
 * @example
 * ```tsx
 * <TimePicker defaultValue={Temporal.PlainTime.from('09:30')} minuteStep={15} onChange={setTime} />
 * <TimePicker hour12 defaultValue={Temporal.PlainTime.from('13:00')} />
 * ```
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  { value: valueProp, defaultValue = null, onChange, minuteStep = 5, hour12 = false, disabled = false, hourLabel = 'Hour', minuteLabel = 'Minute', meridiemLabel = 'AM/PM', id, className },
  ref,
) {
  const [value, setValue] = useControllableState<Temporal.PlainTime | null>({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const h = value ? value.hour : null;
  const m = value ? value.minute : null;

  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  const meridiem = h == null ? '' : h < 12 ? 'AM' : 'PM';
  const dispHours = hour12 ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 24 }, (_, i) => i);
  const dispHour = h == null ? '' : hour12 ? (h % 12 === 0 ? 12 : h % 12) : h;

  const compose = (nextH: number | null, nextM: number | null, nextMer: string) => {
    if (nextH == null && nextM == null) {
      setValue(null);
      return;
    }
    let h24 = nextH ?? 0;
    if (hour12) {
      h24 = (nextH ?? 12) % 12;
      if (nextMer === 'PM') h24 += 12;
    }
    setValue(Temporal.PlainTime.from({ hour: h24, minute: nextM ?? 0 }));
  };

  return (
    <div ref={ref} className={cx('lily-time-picker', className)} id={id}>
      <select
        className="lily-select"
        aria-label={hourLabel}
        disabled={disabled}
        value={dispHour}
        onChange={(e) => compose(e.target.value === '' ? null : Number(e.target.value), m, meridiem)}
      >
        <option value="">--</option>
        {dispHours.map((hr) => (
          <option key={hr} value={hr}>
            {pad2(hr)}
          </option>
        ))}
      </select>
      <span className="lily-time-picker__sep" aria-hidden="true">
        :
      </span>
      <select
        className="lily-select"
        aria-label={minuteLabel}
        disabled={disabled}
        value={m ?? ''}
        onChange={(e) => compose(hour12 ? (dispHour === '' ? null : Number(dispHour)) : h, e.target.value === '' ? null : Number(e.target.value), meridiem)}
      >
        <option value="">--</option>
        {minutes.map((mn) => (
          <option key={mn} value={mn}>
            {pad2(mn)}
          </option>
        ))}
      </select>
      {hour12 && (
        <select
          className="lily-select"
          aria-label={meridiemLabel}
          disabled={disabled}
          value={meridiem}
          onChange={(e) => compose(dispHour === '' ? 12 : Number(dispHour), m, e.target.value)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      )}
    </div>
  );
});
