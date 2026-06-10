import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface FieldsetProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'children'> {
  /** Legend text — the accessible group name, rendered inside `<legend>`. */
  legend: ReactNode;
  /** Optional description displayed below the legend. */
  description?: ReactNode;
  /**
   * Disabled state propagated natively to all descendant form controls via the
   * HTML `disabled` attribute on `<fieldset>`.
   */
  disabled?: boolean;
  /** Form controls to group. */
  children: ReactNode;
}

const CLASS = 'lily-fieldset';

/**
 * Fieldset — groups related form controls with a native `<fieldset>` and
 * `<legend>` for maximum browser and screen-reader compatibility.
 *
 * Setting `disabled` disables every descendant form control in the group — this
 * is native HTML behaviour and requires no extra JS.
 *
 * @example
 * ```tsx
 * <Fieldset legend="Shipping address" description="Where should we send your order?">
 *   <FormField label="Street"><Input /></FormField>
 *   <FormField label="City"><Input /></FormField>
 * </Fieldset>
 * ```
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, description, disabled, children, className, ...rest },
  ref,
) {
  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      className={cx(CLASS, className)}
      {...rest}
    >
      <legend className={`${CLASS}__legend`}>{legend}</legend>
      {description && <p className={`${CLASS}__description`}>{description}</p>}
      {children}
    </fieldset>
  );
});
