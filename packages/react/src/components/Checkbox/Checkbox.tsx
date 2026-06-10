import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Inline label shown next to the checkbox. */
  label?: ReactNode;
}

const CLASS = 'lily-check';

/**
 * Checkbox — a single boolean control with an inline label.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" checked={ok} onChange={…} />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <span className={cx(CLASS, className)}>
      <input ref={ref} type="checkbox" id={inputId} className={`${CLASS}__input`} {...rest} />
      {label && (
        <label className={`${CLASS}__label`} htmlFor={inputId}>
          {label}
        </label>
      )}
    </span>
  );
});
