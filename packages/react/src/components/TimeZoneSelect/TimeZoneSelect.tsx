import { forwardRef, useMemo, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

const CLASS = 'lily-time-zone-select';

/** Small fallback list used when `Intl.supportedValuesOf` is unavailable. */
const FALLBACK_ZONES = [
  'UTC',
  'Asia/Tokyo',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Australia/Sydney',
] as const;

/** The available IANA time-zone ids, sourced from the runtime when possible. */
function supportedTimeZones(): readonly string[] {
  const supported = (
    Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf;
  if (typeof supported === 'function') {
    try {
      const zones = supported('timeZone');
      if (zones.length > 0) return zones;
    } catch {
      // fall through to the static list
    }
  }
  return FALLBACK_ZONES;
}

export interface TimeZoneSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Selected IANA time-zone id (controlled). */
  value?: string;
  /** Initial IANA time-zone id (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected IANA time-zone id. */
  onChange?: (value: string) => void;
  /** Restrict the list to a fixed set of IANA ids (defaults to the runtime list). */
  zones?: readonly string[];
  /** Optional placeholder shown as a disabled first option. */
  placeholder?: string;
}

/**
 * TimeZoneSelect — choose an IANA time-zone id (e.g. `'Asia/Tokyo'`) from a
 * native `<select>`. The option list comes from `Intl.supportedValuesOf`, with
 * a small static fallback for runtimes that lack it. The value is the IANA id
 * string, the form the Temporal API consumes (`Temporal.Now.zonedDateTimeISO(tz)`).
 *
 * @example
 * ```tsx
 * <TimeZoneSelect defaultValue="Asia/Tokyo" onChange={setZone} />
 * ```
 */
export const TimeZoneSelect = forwardRef<HTMLSelectElement, TimeZoneSelectProps>(
  function TimeZoneSelect(
    { value: valueProp, defaultValue, onChange, zones, placeholder, className, disabled, ...rest },
    ref,
  ) {
    const [value, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue,
      onChange: onChange as ((v: string | undefined) => void) | undefined,
    });

    const options = useMemo(() => zones ?? supportedTimeZones(), [zones]);

    return (
      <span className={cx(CLASS, className)}>
        <select
          {...rest}
          ref={ref}
          className="lily-select"
          disabled={disabled}
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
        >
          {placeholder != null && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </span>
    );
  },
);
