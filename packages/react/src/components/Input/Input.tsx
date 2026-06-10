import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../FormField';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

const CLASS = 'lily-input';

/**
 * Input — a single-line text control.
 *
 * Inside a {@link FormField} it inherits `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * @example
 * ```tsx
 * <FormField label="Name"><Input /></FormField>
 * <Input type="email" aria-label="Email" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', className, ...rest },
  ref,
) {
  const fieldProps = useFieldControl(rest);
  return (
    <input
      ref={ref}
      className={cx(CLASS, size !== 'md' && `${CLASS}--${size}`, className)}
      {...fieldProps}
    />
  );
});
