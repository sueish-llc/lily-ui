import { forwardRef, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CopyButtonProps {
  /** The text written to the clipboard on click. */
  value: string;
  /** Visible label beside the icon. Omit for an icon-only button. */
  label?: ReactNode;
  /** Accessible name (used as `aria-label`, esp. when icon-only). @default 'Copy' */
  copyLabel?: string;
  /** Announced and shown briefly after a successful copy. @default 'Copied' */
  copiedLabel?: string;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md';
  /** Called with the copied value after a successful copy. */
  onCopy?: (value: string) => void;
  className?: string;
}

const CLASS = 'lily-copy-button';

const CopyIcon = () => (
  <svg className={`${CLASS}__icon`} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const CheckIcon = () => (
  <svg className={`${CLASS}__icon`} viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * CopyButton — copies `value` to the clipboard and confirms with a check icon.
 *
 * Shows a copy icon (icon-only by default, or with a `label`). After a
 * successful copy it swaps to a check for a moment and announces "Copied" via a
 * polite live region.
 *
 * @example
 * ```tsx
 * <CopyButton value="--lily-color-primary-100" />
 * <CopyButton value={code} label="Copy" />
 * ```
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, label, copyLabel = 'Copy', copiedLabel = 'Copied', size = 'md', onCopy, className },
  ref,
) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }, [value, onCopy]);

  return (
    <button
      ref={ref}
      type="button"
      className={cx(CLASS, `${CLASS}--${size}`, copied && `${CLASS}--copied`, className)}
      aria-label={label ? undefined : copied ? copiedLabel : copyLabel}
      onClick={handleClick}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {label != null && (
        <span className={`${CLASS}__label`}>{copied ? copiedLabel : label}</span>
      )}
      <span className="lily-visually-hidden" role="status" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </button>
  );
});
