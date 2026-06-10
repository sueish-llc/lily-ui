import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFocusTrap, useDismiss, useScrollLock, usePresence } from '../../hooks';
import { CloseButton } from '../CloseButton';

export interface ModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the modal requests to close (Escape, backdrop, close button). */
  onClose: () => void;
  /** Dialog title (announced as the accessible name). */
  title?: ReactNode;
  /** Footer content (e.g. action buttons). */
  footer?: ReactNode;
  /** Size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Close when the backdrop is clicked. @default true */
  closeOnBackdrop?: boolean;
  /** Body content. */
  children: ReactNode;
  className?: string;
}

const CLASS = 'lily-modal';

/**
 * Modal — an accessible dialog rendered in a portal over a backdrop.
 *
 * Implements the WAI-ARIA dialog pattern: `role="dialog"` + `aria-modal`,
 * focus trapped within, focus restored on close, background scroll locked, and
 * Escape/backdrop dismissal.
 *
 * @example
 * ```tsx
 * <Modal open={open} onClose={close} title="Confirm" footer={<Button>OK</Button>}>
 *   Are you sure?
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  title,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const title_id = useId();
  const [mounted, setMounted] = useState(false);

  // Portal target only exists on the client (SSR-safe).
  useEffect(() => setMounted(true), []);

  // Keep the portal mounted through the exit animation; `state` drives the
  // enter/exit visuals (and honors the motion tier automatically).
  const { isPresent, state, ref: presenceRef } = usePresence(open);

  // Focus trap, scroll lock and dismissal track the *open* prop (not presence),
  // so they engage/release immediately while the visual exit finishes.
  useFocusTrap(dialogRef, open);
  useScrollLock(open);
  // Escape always closes; clicking the backdrop (outside the dialog) closes
  // only when allowed. This keeps keyboard + pointer dismissal in one place.
  useDismiss(dialogRef, open, onClose, { outsideClick: closeOnBackdrop });

  if (!mounted || !isPresent) return null;

  const backdropAnim = open ? 'fade-in' : 'fade-out';
  const dialogAnim = open ? 'zoom-in' : 'zoom-out';

  return createPortal(
    <div className={cx('lily-backdrop', 'lily-animate', `lily-animate--${backdropAnim}`, 'lily-animate--snappy')} data-state={state}>
      <div
        ref={mergeRefs(dialogRef, presenceRef)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? title_id : undefined}
        data-state={state}
        className={cx(
          CLASS,
          size !== 'md' && `${CLASS}--${size}`,
          'lily-animate',
          `lily-animate--${dialogAnim}`,
          'lily-animate--snappy',
          className,
        )}
      >
        {title && (
          <div className={`${CLASS}__header`}>
            <h2 id={title_id} className={`${CLASS}__title`}>
              {title}
            </h2>
            <CloseButton onClick={onClose} />
          </div>
        )}
        <div className={`${CLASS}__body`}>{children}</div>
        {footer && <div className={`${CLASS}__footer`}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
