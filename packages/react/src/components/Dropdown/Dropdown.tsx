import {
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState, useDismiss } from '../../hooks';

export interface DropdownProps {
  /** The trigger element label. */
  trigger: ReactNode;
  /** Menu items (use `Dropdown.Item` / `Dropdown.Divider`). */
  children: ReactNode;
  /** Align the menu to the end (right) edge. @default false */
  alignEnd?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Props for the trigger button. */
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
}

const CLASS = 'lily-dropdown';

/**
 * Dropdown — a toggleable menu anchored to a trigger button (a self-contained
 * trigger + popup). For a standalone menu without a trigger — e.g. inside a
 * context menu or a custom popup — use the `Menu` primitive instead.
 *
 * The trigger exposes `aria-haspopup="menu"` and `aria-expanded`; the menu uses
 * `role="menu"` with `role="menuitem"` children. Closes on Escape or outside
 * click.
 *
 * @example
 * ```tsx
 * <Dropdown trigger="Options">
 *   <Dropdown.Item onClick={…}>Edit</Dropdown.Item>
 *   <Dropdown.Divider />
 *   <Dropdown.Item onClick={…}>Delete</Dropdown.Item>
 * </Dropdown>
 * ```
 */
export function Dropdown({
  trigger,
  children,
  alignEnd = false,
  open,
  defaultOpen = false,
  onOpenChange,
  triggerProps,
  className,
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  useDismiss(rootRef, isOpen, () => setOpen(false));

  return (
    <div ref={rootRef} className={cx(CLASS, className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        {...triggerProps}
      >
        {trigger}
      </button>
      <ul
        className={cx(
          `${CLASS}__menu`,
          alignEnd && `${CLASS}__menu--end`,
          'lily-animate',
          'lily-animate--fade-in',
          'lily-animate--snappy',
        )}
        role="menu"
        hidden={!isOpen}
      >
        {children}
      </ul>
    </div>
  );
}

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function DropdownItem({ className, children, ...rest }: DropdownItemProps) {
  return (
    <li role="none">
      <button type="button" role="menuitem" className={cx(`${CLASS}__item`, className)} {...rest}>
        {children}
      </button>
    </li>
  );
}

function DropdownDivider() {
  return (
    <li role="none">
      <hr className={`${CLASS}__divider`} />
    </li>
  );
}

DropdownItem.displayName = 'Dropdown.Item';
DropdownDivider.displayName = 'Dropdown.Divider';

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
