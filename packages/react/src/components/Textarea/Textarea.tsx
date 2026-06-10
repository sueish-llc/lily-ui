import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../FormField';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const CLASS = 'lily-textarea';

/**
 * Textarea — a multi-line text control.
 *
 * Inside a {@link FormField} it inherits field wiring automatically.
 *
 * @example
 * ```tsx
 * <FormField label="Bio"><Textarea rows={4} /></FormField>
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...rest },
  ref,
) {
  const fieldProps = useFieldControl(rest);
  return <textarea ref={ref} className={cx(CLASS, className)} {...fieldProps} />;
});
