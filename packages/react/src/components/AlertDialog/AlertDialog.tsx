import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFocusTrap, useDismiss, useScrollLock, usePresence } from '../../hooks';

/** Semantic intent of the alert dialog. */
export type AlertDialogStatus = 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';

export interface AlertDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /**
   * Called when the dialog requests to close (Escape key or cancel action).
   * Overlay clicks do NOT close the dialog — an explicit action is required.
   */
  onClose: () => void;
  /** Dialog title, announced as the accessible name. */
  title: ReactNode;
  /** Description / body content, announced as the accessible description. */
  children: ReactNode;
  /**
   * Action buttons (e.g. a confirm button and a cancel button). Rendered in the
   * footer in the order provided.
   */
  actions?: ReactNode;
  /** Semantic intent — tints the icon area. @default 'primary' */
  status?: AlertDialogStatus;
  className?: string;
}

const CLASS = 'lily-alert-dialog';

/**
 * AlertDialog — a confirmation dialog for consequential, irreversible actions.
 *
 * Implements the WAI-ARIA `alertdialog` pattern: `role="alertdialog"` +
 * `aria-modal`, labelled by its title and described by its body. Focus is
 * trapped within and restored on close; background scroll is locked; Escape
 * closes the dialog. Unlike Modal, clicking the backdrop does NOT dismiss it —
 * the user must take an explicit action (confirm or cancel).
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   open={open}
 *   onClose={close}
 *   title="Delete item?"
 *   status="danger"
 *   actions={
 *     <>
 *       <Button variant="ghost" onClick={close}>Cancel</Button>
 *       <Button status="danger" onClick={confirmDelete}>Delete</Button>
 *     </>
 *   }
 * >
 *   This action cannot be undone.
 * </AlertDialog>
 * ```
 */
export function AlertDialog({
  open,
  onClose,
  title,
  children,
  actions,
  status = 'primary',
  className,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const [mounted, setMounted] = useState(false);

  // Portal target only exists on the client (SSR-safe).
  useEffect(() => setMounted(true), []);

  const { isPresent, state, ref: presenceRef } = usePresence(open);

  useFocusTrap(dialogRef, open);
  useScrollLock(open);
  // Escape closes; backdrop clicks do NOT (outsideClick: false per spec).
  useDismiss(dialogRef, open, onClose, { outsideClick: false });

  if (!mounted || !isPresent) return null;

  const backdropAnim = open ? 'fade-in' : 'fade-out';
  const dialogAnim = open ? 'zoom-in' : 'zoom-out';

  return createPortal(
    <div
      className={cx(
        'lily-backdrop',
        'lily-animate',
        `lily-animate--${backdropAnim}`,
        'lily-animate--snappy',
      )}
      data-state={state}
    >
      <div
        ref={mergeRefs(dialogRef, presenceRef)}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-state={state}
        className={cx(
          CLASS,
          status !== 'neutral' && `${CLASS}--${status}`,
          'lily-animate',
          `lily-animate--${dialogAnim}`,
          'lily-animate--snappy',
          className,
        )}
      >
        <div className={`${CLASS}__header`}>
          <h2 id={titleId} className={`${CLASS}__title`}>
            {title}
          </h2>
        </div>
        <div id={descId} className={`${CLASS}__body`}>
          {children}
        </div>
        {actions && <div className={`${CLASS}__footer`}>{actions}</div>}
      </div>
    </div>,
    document.body,
  );
}
