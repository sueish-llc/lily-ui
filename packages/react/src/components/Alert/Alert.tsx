import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { CloseButton } from '../CloseButton';

export type AlertStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Semantic color/intent. @default 'primary' */
  status?: AlertStatus;
  /** Optional bold title shown above the body. */
  title?: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Show a dismiss button; called when clicked. */
  onClose?: () => void;
  /** Accessible label for the dismiss button. @default 'Close' */
  closeLabel?: string;
  /**
   * ARIA live semantics. Use `'alert'` (assertive) for errors that need
   * immediate attention, `'status'` (polite) for non-critical messages.
   * @default 'status'
   */
  role?: 'alert' | 'status';
}

const CLASS = 'lily-alert';

/**
 * Alert — a contextual feedback message.
 *
 * @example
 * ```tsx
 * <Alert status="success" title="Saved">Your changes are stored.</Alert>
 * <Alert status="danger" role="alert" onClose={dismiss}>Something failed.</Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { status = 'primary', title, icon, onClose, closeLabel = 'Close', role = 'status', className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} role={role} data-status={status} className={cx(CLASS, className)} {...rest}>
      {icon && (
        <span className={`${CLASS}__icon`} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={`${CLASS}__body`}>
        {title && <div className={`${CLASS}__title`}>{title}</div>}
        {children}
      </div>
      {onClose && <CloseButton onClick={onClose} label={closeLabel} />}
    </div>
  );
});
