import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../FormField';

export type RangeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const CLASS = 'lily-range';

/**
 * Range — a slider control (`<input type="range">`).
 *
 * Inside a {@link FormField} it inherits field wiring automatically. Provide an
 * `aria-label` or a FormField label so the slider is named.
 *
 * @example
 * ```tsx
 * <FormField label="Volume"><Range min={0} max={100} /></FormField>
 * ```
 */
export const Range = forwardRef<HTMLInputElement, RangeProps>(function Range(
  { className, ...rest },
  ref,
) {
  const fieldProps = useFieldControl(rest);
  return <input ref={ref} type="range" className={cx(CLASS, className)} {...fieldProps} />;
});
