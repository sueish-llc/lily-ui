import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Inline label shown next to the radio. */
  label?: ReactNode;
}

const CLASS = 'lily-check';

/**
 * Radio — a single option in a radio group. Group radios by sharing a `name`.
 * For an accessible group, wrap them in a `<fieldset>` with a `<legend>`.
 *
 * @example
 * ```tsx
 * <fieldset>
 *   <legend>Plan</legend>
 *   <Radio name="plan" value="free" label="Free" />
 *   <Radio name="plan" value="pro" label="Pro" />
 * </fieldset>
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <span className={cx(CLASS, className)}>
      <input ref={ref} type="radio" id={inputId} className={`${CLASS}__input`} {...rest} />
      {label && (
        <label className={`${CLASS}__label`} htmlFor={inputId}>
          {label}
        </label>
      )}
    </span>
  );
});
