import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../FormField';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const CLASS = 'lily-select';

/**
 * Select — a native `<select>` dropdown (accessible by default). Use this for a
 * fixed list of options; for a searchable / typeahead list with filtering, use
 * `Combobox` instead.
 *
 * Inside a {@link FormField} it inherits field wiring automatically.
 *
 * @example
 * ```tsx
 * <FormField label="Country">
 *   <Select>
 *     <option value="jp">Japan</option>
 *     <option value="us">USA</option>
 *   </Select>
 * </FormField>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  const fieldProps = useFieldControl(rest);
  return (
    <select ref={ref} className={cx(CLASS, className)} {...fieldProps}>
      {children}
    </select>
  );
});
