import {
  cloneElement,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState, useDismiss } from '../../hooks';

export interface PopoverProps {
  /** Optional header shown above the body. */
  title?: ReactNode;
  /** Popover body content. */
  content: ReactNode;
  /**
   * The trigger element. It receives `aria-expanded`, `aria-haspopup`, and an
   * onClick toggle; it must be a focusable element.
   */
  children: ReactElement<{
    'aria-expanded'?: boolean;
    'aria-haspopup'?: 'dialog';
    onClick?: (e: React.MouseEvent) => void;
  }>;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const CLASS = 'lily-popover';

/**
 * Popover — a click-triggered overlay with optional title and rich content.
 *
 * Uses `role="dialog"` (non-modal) and closes on Escape/outside click.
 *
 * @example
 * ```tsx
 * <Popover title="Info" content={<p>Details…</p>}>
 *   <button>More</button>
 * </Popover>
 * ```
 */
export function Popover({
  title,
  content,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: PopoverProps) {
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  useDismiss(rootRef, isOpen, () => setOpen(false));

  const trigger = cloneElement(children, {
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    onClick: (e: React.MouseEvent) => {
      setOpen(!isOpen);
      children.props.onClick?.(e);
    },
  });

  return (
    <span ref={rootRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {trigger}
      <div
        role="dialog"
        id={id}
        aria-label={typeof title === 'string' ? title : undefined}
        className={cx(CLASS, 'lily-animate', 'lily-animate--zoom-in', 'lily-animate--snappy', className)}
        hidden={!isOpen}
      >
        {title && <div className={`${CLASS}__header`}>{title}</div>}
        <div className={`${CLASS}__body`}>{content}</div>
      </div>
    </span>
  );
}
