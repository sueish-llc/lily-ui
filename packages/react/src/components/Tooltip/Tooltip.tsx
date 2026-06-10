import {
  cloneElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export interface TooltipProps {
  /** The tooltip text. */
  content: ReactNode;
  /**
   * The trigger element. It receives `aria-describedby` and hover/focus
   * handlers; it must be a focusable element for keyboard accessibility.
   */
  children: ReactElement<{
    'aria-describedby'?: string;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
  }>;
}

const CLASS = 'lily-tooltip';

/**
 * Tooltip — a small label shown on hover/focus, associated via
 * `aria-describedby` (WAI-ARIA tooltip pattern).
 *
 * @example
 * ```tsx
 * <Tooltip content="Delete"><button aria-label="Delete">🗑</button></Tooltip>
 * ```
 */
export function Tooltip({ content, children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const trigger = cloneElement(children, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      setOpen(true);
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      setOpen(false);
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      setOpen(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      setOpen(false);
      children.props.onBlur?.(e);
    },
  });

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      {trigger}
      <span
        role="tooltip"
        id={id}
        className={cx(CLASS, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy')}
        hidden={!open}
      >
        {content}
      </span>
    </span>
  );
}
