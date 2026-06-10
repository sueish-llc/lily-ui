import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';
import { useFieldControl } from '../FormField';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'> {
  /** Controlled value (`null` when empty). */
  value?: number | null;
  /** Initial value when uncontrolled. */
  defaultValue?: number | null;
  /** Called with the new value (`null` when cleared). */
  onChange?: (value: number | null) => void;
  /** Minimum value. */
  min?: number;
  /** Maximum value. */
  max?: number;
  /** Step for the buttons and keyboard. @default 1 */
  step?: number;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label for the decrement button. @default 'Decrease' */
  decrementLabel?: string;
  /** Accessible label for the increment button. @default 'Increase' */
  incrementLabel?: string;
}

function clamp(n: number, min?: number, max?: number): number {
  if (min != null && n < min) return min;
  if (max != null && n > max) return max;
  return n;
}

/**
 * NumberInput — a numeric field with stepper buttons. The native input keeps
 * spinbutton semantics (Up/Down arrows), and the buttons add a pointer
 * affordance. Inherits FormField wiring when nested in one.
 *
 * @example
 * ```tsx
 * <FormField label="数量"><NumberInput min={0} max={99} defaultValue={1} /></FormField>
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value: valueProp, defaultValue = null, onChange, min, max, step = 1, size = 'md', decrementLabel = 'Decrease', incrementLabel = 'Increase', className, disabled, ...rest },
  ref,
) {
  const [value, setValue] = useControllableState<number | null>({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const fieldProps = useFieldControl(rest);

  const base = value ?? min ?? 0;
  const atMin = min != null && value != null && value <= min;
  const atMax = max != null && value != null && value >= max;

  return (
    <div className={cx('lily-number-input', size !== 'md' && `lily-number-input--${size}`, className)}>
      <button
        type="button"
        className="lily-number-input__btn"
        aria-label={decrementLabel}
        disabled={disabled || atMin}
        onClick={() => setValue(clamp(base - step, min, max))}
      >
        <span aria-hidden="true">−</span>
      </button>
      <input
        ref={ref}
        type="number"
        className="lily-number-input__field"
        inputMode="decimal"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          setValue(raw === '' ? null : clamp(Number(raw), min, max));
        }}
        {...fieldProps}
      />
      <button
        type="button"
        className="lily-number-input__btn"
        aria-label={incrementLabel}
        disabled={disabled || atMax}
        onClick={() => setValue(clamp(base + step, min, max))}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
});
