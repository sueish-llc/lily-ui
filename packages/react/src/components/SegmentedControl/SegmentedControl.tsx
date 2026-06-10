import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface SegmentedOption {
  /** Submitted value. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Disable this segment. */
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The segments. */
  options: SegmentedOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Radio-group name (auto-generated if omitted). */
  name?: string;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill the container width. @default false */
  block?: boolean;
}

/**
 * SegmentedControl — a single-select toggle group. Built on native radios, so
 * grouping and arrow-key navigation are handled by the browser; provide an
 * `aria-label` (or wrap in a FormField) to name the group.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   aria-label="表示"
 *   options={[{ value: 'list', label: 'リスト' }, { value: 'grid', label: 'グリッド' }]}
 *   defaultValue="list"
 * />
 * ```
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { options, value: valueProp, defaultValue, onChange, name: nameProp, size = 'md', block = false, className, ...rest },
  ref,
) {
  const autoName = useId();
  const name = nameProp ?? autoName;
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? options[0]?.value ?? '',
    onChange,
  });

  return (
    <div
      ref={ref}
      className={cx('lily-segmented', size !== 'md' && `lily-segmented--${size}`, block && 'lily-segmented--block', className)}
      role="radiogroup"
      {...rest}
    >
      {options.map((opt) => (
        <label key={opt.value} className="lily-segmented__option">
          <input
            type="radio"
            className="lily-visually-hidden"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled}
            onChange={() => setValue(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
});
