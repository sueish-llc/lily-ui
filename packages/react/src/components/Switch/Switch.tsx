import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Inline label shown next to the switch. */
  label?: ReactNode;
}

const CLASS = 'lily-switch';

/**
 * Switch — a toggle styled as a sliding switch. It is a checkbox under the
 * hood with `role="switch"`, so it's fully keyboard accessible.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" checked={on} onChange={…} />
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <span className={cx(CLASS, className)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        id={inputId}
        className={`${CLASS}__input`}
        {...rest}
      />
      {label && (
        <label className={`${CLASS}__label`} htmlFor={inputId}>
          {label}
        </label>
      )}
    </span>
  );
});
