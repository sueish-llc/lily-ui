import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type ChipStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color. @default 'neutral' */
  status?: ChipStatus;
  /** Smaller size. @default false */
  small?: boolean;
  /** Selected/active (e.g. a filter chip). Renders a solid fill + `aria-pressed`. */
  selected?: boolean;
  /** Make the whole chip a toggle button. Ignored when `onRemove` is set. */
  clickable?: boolean;
  /** When provided, renders a trailing remove button that calls this handler. */
  onRemove?: () => void;
  /** Accessible label for the remove button. @default 'Remove' */
  removeLabel?: string;
  children?: ReactNode;
}

/**
 * Chip / Tag — a compact token. Can be a selectable toggle (`clickable`) or
 * removable (`onRemove`); these two modes are mutually exclusive to avoid
 * nested interactive elements.
 *
 * @example
 * ```tsx
 * <Chip status="info">React</Chip>
 * <Chip clickable selected onClick={toggle}>絞り込み</Chip>
 * <Chip onRemove={() => remove(id)}>ada@example.com</Chip>
 * ```
 */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { status = 'neutral', small = false, selected = false, clickable = false, onRemove, removeLabel = 'Remove', className, children, ...rest },
  ref,
) {
  const removable = typeof onRemove === 'function';
  const asButton = clickable && !removable;
  const classes = cx(
    'lily-chip',
    small && 'lily-chip--sm',
    selected && 'lily-chip--selected',
    asButton && 'lily-chip--clickable',
    className,
  );
  const dataStatus = status !== 'neutral' && !selected ? status : undefined;

  if (asButton) {
    const { type: _omit, ...buttonRest } = rest as HTMLAttributes<HTMLSpanElement> & { type?: string };
    return (
      <button
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        data-status={dataStatus}
        aria-pressed={selected}
        {...(buttonRest as object)}
      >
        {children}
      </button>
    );
  }

  return (
    <span ref={ref} className={classes} data-status={dataStatus} {...rest}>
      <span>{children}</span>
      {removable && (
        <button type="button" className="lily-chip__remove" aria-label={removeLabel} onClick={onRemove}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </span>
  );
});
