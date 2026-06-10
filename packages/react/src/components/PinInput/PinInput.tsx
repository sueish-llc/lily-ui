import { forwardRef, useRef, type KeyboardEvent, type ClipboardEvent, type ChangeEvent } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface PinInputProps {
  /** Number of cells. @default 6 */
  length?: number;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. @default '' */
  defaultValue?: string;
  /** Called with the current concatenated value on every change. */
  onChange?: (value: string) => void;
  /** Called once all cells are filled. */
  onComplete?: (value: string) => void;
  /** Restrict input and set the mobile keyboard. @default 'numeric' */
  type?: 'numeric' | 'text';
  /** Obscure entered characters (one-time passcodes). @default false */
  mask?: boolean;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Disable all cells. @default false */
  disabled?: boolean;
  /** Base accessible label for each cell, suffixed by position. @default 'Digit' */
  label?: string;
  className?: string;
}

/**
 * PinInput — a row of single-character fields for codes / one-time passcodes,
 * with auto-advance, backspace-to-previous, arrow navigation, and paste
 * distribution.
 *
 * @example
 * ```tsx
 * <PinInput length={6} onComplete={verify} label="認証コード" />
 * ```
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  { length = 6, value: valueProp, defaultValue = '', onChange, onComplete, type = 'numeric', mask = false, size = 'md', disabled = false, label = 'Digit', className },
  ref,
) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue, onChange });
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  const focusCell = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string) => {
    setValue(next);
    if (next.length === length && !next.includes(' ')) onComplete?.(next);
  };

  const setCharAt = (i: number, ch: string): string => {
    const arr = Array.from({ length }, (_, k) => value[k] ?? ' ');
    arr[i] = ch || ' ';
    return arr.join('').replace(/ +$/, '');
  };

  const isAllowed = (ch: string) => (type === 'numeric' ? /^[0-9]$/.test(ch) : ch.length === 1);

  const handleChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.slice(-1);
    if (ch && !isAllowed(ch)) return;
    commit(setCharAt(i, ch));
    if (ch && i < length - 1) focusCell(i + 1);
  };

  const handleKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) {
      e.preventDefault();
      commit(setCharAt(i - 1, ''));
      focusCell(i - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusCell(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusCell(i + 1);
    }
  };

  const handlePaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').split('').filter(isAllowed);
    if (pasted.length === 0) return;
    const arr = Array.from({ length }, (_, k) => value[k] ?? ' ');
    for (let k = 0; k < pasted.length && i + k < length; k++) arr[i + k] = pasted[k]!;
    commit(arr.join('').replace(/ +$/, ''));
    focusCell(Math.min(length - 1, i + pasted.length));
  };

  return (
    <div ref={ref} className={cx('lily-pin-input', size !== 'md' && `lily-pin-input--${size}`, className)}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="lily-pin-input__field"
          type={mask ? 'password' : 'text'}
          inputMode={type === 'numeric' ? 'numeric' : 'text'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={ch}
          aria-label={`${label} ${i + 1}`}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste(i)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
});
