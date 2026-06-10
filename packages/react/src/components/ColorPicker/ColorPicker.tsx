import { forwardRef, useId } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

/** A friendly default palette drawn from the 彩 worldview + neutrals. */
export const DEFAULT_SWATCHES = [
  '#cd2e69',
  '#f05537',
  '#ee4d7a',
  '#e89c0c',
  '#2f7a43',
  '#41549f',
  '#534d45',
  '#14110e',
];

export interface ColorPickerProps {
  /** Controlled value (hex). */
  value?: string;
  /** Initial value when uncontrolled. @default DEFAULT_SWATCHES[0] */
  defaultValue?: string;
  /** Called with the chosen hex color. */
  onChange?: (hex: string) => void;
  /** Preset swatches. @default DEFAULT_SWATCHES */
  swatches?: string[];
  /** Allow a custom color via the native picker. @default true */
  custom?: boolean;
  /** Label for the custom-color control. @default 'Custom' */
  customLabel?: string;
  /** Accessible label for the swatch group. @default 'Color' */
  'aria-label'?: string;
  className?: string;
}

/**
 * ColorPicker — a palette of preset swatches plus an optional native custom
 * color input. Swatches are toggle buttons; the active one shows a ring.
 *
 * @example
 * ```tsx
 * <ColorPicker aria-label="テーマ色" defaultValue="#cd2e69" onChange={setColor} />
 * ```
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  { value: valueProp, defaultValue, onChange, swatches = DEFAULT_SWATCHES, custom = true, customLabel = 'Custom', className, ...rest },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? swatches[0] ?? '#000000',
    onChange,
  });
  const customId = useId();

  return (
    <div ref={ref} className={cx('lily-color-picker', className)}>
      <div className="lily-color-picker__swatches" role="group" aria-label={rest['aria-label'] ?? 'Color'}>
        {swatches.map((hex) => (
          <button
            key={hex}
            type="button"
            className="lily-color-picker__swatch"
            style={{ backgroundColor: hex }}
            aria-label={hex}
            aria-pressed={value.toLowerCase() === hex.toLowerCase()}
            onClick={() => setValue(hex)}
          />
        ))}
      </div>
      {custom && (
        <span className="lily-color-picker__custom">
          <label htmlFor={customId}>{customLabel}</label>
          <input
            id={customId}
            type="color"
            className="lily-color-picker__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </span>
      )}
    </div>
  );
});
