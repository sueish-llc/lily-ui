import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState, useDismiss } from '../../hooks';

/** Where the card sits relative to its trigger. */
export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface HoverCardProps {
  /** Rich card content shown on hover/focus. */
  content: ReactNode;
  /**
   * The trigger element. It receives hover/focus handlers and
   * `aria-describedby`; it must be a focusable element so the card is reachable
   * by keyboard.
   */
  children: ReactElement<{
    'aria-describedby'?: string;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
  }>;
  /** Side the card opens on. @default 'bottom' */
  placement?: HoverCardPlacement;
  /** Delay before opening, in ms. @default 200 */
  openDelay?: number;
  /** Delay before closing, in ms. @default 150 */
  closeDelay?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const CLASS = 'lily-hover-card';

/**
 * HoverCard — a floating card that reveals supplementary rich content when the
 * trigger is hovered or focused.
 *
 * Unlike Popover it is not a dialog: it opens on hover/focus with an open/close
 * delay and is purely informational. It opens by keyboard focus too, and closes
 * on blur or Escape, so it never traps anyone. Reuses the Popover positioning
 * and markup.
 *
 * @example
 * ```tsx
 * <HoverCard content={<UserSummary id={id} />}>
 *   <a href={`/users/${id}`}>@lily</a>
 * </HoverCard>
 * ```
 */
export function HoverCard({
  content,
  children,
  placement = 'bottom',
  openDelay = 200,
  closeDelay = 150,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: HoverCardProps) {
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  // Escape and outside click close it (blur is handled per-trigger below).
  useDismiss(rootRef, isOpen, () => setOpen(false));

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const schedule = (next: boolean, delay: number) => {
    clear();
    timer.current = setTimeout(() => setOpen(next), delay);
  };

  // Clear any pending open/close timer on unmount so it can't fire afterwards.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const trigger = cloneElement(children, {
    'aria-describedby': isOpen ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      schedule(true, openDelay);
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      schedule(false, closeDelay);
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      clear();
      setOpen(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      clear();
      setOpen(false);
      children.props.onBlur?.(e);
    },
  });

  return (
    <span
      ref={rootRef}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => schedule(true, openDelay)}
      onMouseLeave={() => schedule(false, closeDelay)}
    >
      {trigger}
      <div
        role="tooltip"
        id={id}
        className={cx(
          CLASS,
          `${CLASS}--${placement}`,
          'lily-animate',
          'lily-animate--zoom-in',
          'lily-animate--snappy',
          className,
        )}
        hidden={!isOpen}
      >
        <div className={`${CLASS}__body`}>{content}</div>
      </div>
    </span>
  );
}
