import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

const CLASS = 'lily-input-group';

export type InputGroupProps = HTMLAttributes<HTMLDivElement>;

/** InputGroup — joins a control with leading/trailing addons. */
const InputGroupRoot = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(CLASS, className)} {...rest}>
      {children}
    </div>
  );
});

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

const InputGroupAddon = forwardRef<HTMLSpanElement, InputGroupAddonProps>(function InputGroupAddon(
  { className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx(`${CLASS}__addon`, className)} {...rest}>
      {children}
    </span>
  );
});

InputGroupAddon.displayName = 'InputGroup.Addon';

/**
 * InputGroup — joins addons (text/icons/buttons) with a control into one unit.
 *
 * Decorative text addons should be associated with the control via
 * `aria-describedby` or a visible {@link FormField} label.
 *
 * @example
 * ```tsx
 * <InputGroup>
 *   <InputGroup.Addon>@</InputGroup.Addon>
 *   <Input aria-label="Username" />
 * </InputGroup>
 * ```
 */
export const InputGroup = Object.assign(InputGroupRoot, { Addon: InputGroupAddon });
