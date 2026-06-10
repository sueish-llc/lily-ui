import { forwardRef, useId } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

const STAR = '★';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled value (0–`max`). */
  value?: number;
  /** Initial value when uncontrolled. @default 0 */
  defaultValue?: number;
  /** Called with the newly selected rating. */
  onChange?: (value: number) => void;
  /** Number of stars. @default 5 */
  max?: number;
  /** Radio-group name (auto-generated if omitted). */
  name?: string;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Render as a non-interactive, labeled display. @default false */
  readOnly?: boolean;
  /** Disable interaction. @default false */
  disabled?: boolean;
  /** Group label, e.g. "Rating". @default 'Rating' */
  label?: string;
  /** Builds each star's accessible name. @default `${n} / ${max}` */
  starLabel?: (n: number, max: number) => string;
}

/**
 * Rating — a star rating. Interactive by default (native radios → arrow-key
 * support); `readOnly` renders a labeled, non-interactive display. The label /
 * value text means the rating is never conveyed by color alone.
 *
 * @example
 * ```tsx
 * <Rating defaultValue={3} label="評価" onChange={setScore} />
 * <Rating value={4} readOnly />
 * ```
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { value: valueProp, defaultValue = 0, onChange, max = 5, name: nameProp, size = 'md', readOnly = false, disabled = false, label = 'Rating', starLabel = (n, m) => `${n} / ${m}`, className, ...rest },
  ref,
) {
  const autoName = useId();
  const name = nameProp ?? autoName;
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange });
  const classes = cx('lily-rating', size !== 'md' && `lily-rating--${size}`, className);
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={classes} role="img" aria-label={starLabel(value, max)} {...(rest as object)}>
        {stars.map((n) => (
          <span key={n} className={cx('lily-rating__star', n <= value && 'lily-rating__star--on')} aria-hidden="true">
            {STAR}
          </span>
        ))}
      </span>
    );
  }

  return (
    <div ref={ref} className={classes} role="radiogroup" aria-label={label} {...rest}>
      {stars.map((n) => (
        <label key={n} className="lily-rating__label">
          <input
            type="radio"
            className="lily-visually-hidden"
            name={name}
            value={n}
            checked={value === n}
            disabled={disabled}
            aria-label={starLabel(n, max)}
            onChange={() => setValue(n)}
          />
          <span className={cx('lily-rating__star', n <= value && 'lily-rating__star--on')} aria-hidden="true">
            {STAR}
          </span>
        </label>
      ))}
    </div>
  );
});
