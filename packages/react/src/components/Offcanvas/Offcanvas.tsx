import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFocusTrap, useDismiss, useScrollLock, usePresence } from '../../hooks';
import { CloseButton } from '../CloseButton';
import type { AnimationName } from '../../motion/animations';

export type OffcanvasPlacement = 'start' | 'end' | 'top' | 'bottom';

/** Slide animation per edge — enter slides in from the edge, exit reverses. */
const ENTER_ANIM: Record<OffcanvasPlacement, AnimationName> = {
  start: 'slide-in-left',
  end: 'slide-in-right',
  top: 'slide-in-down',
  bottom: 'slide-in-up',
};
const EXIT_ANIM: Record<OffcanvasPlacement, AnimationName> = {
  start: 'slide-out-left',
  end: 'slide-out-right',
  top: 'slide-out-up',
  bottom: 'slide-out-down',
};

export interface OffcanvasProps {
  /** Whether the panel is open. */
  open: boolean;
  /** Called when the panel requests to close. */
  onClose: () => void;
  /** Edge to slide in from. @default 'start' */
  placement?: OffcanvasPlacement;
  /** Panel title (accessible name). */
  title?: ReactNode;
  /** Body content. */
  children: ReactNode;
  className?: string;
}

const CLASS = 'lily-offcanvas';

/**
 * Offcanvas — a panel that slides in from a screen edge, over a backdrop.
 *
 * Same accessibility model as {@link Modal}: dialog semantics, focus trap,
 * scroll lock, Escape/backdrop dismissal.
 *
 * @example
 * ```tsx
 * <Offcanvas open={open} onClose={close} placement="end" title="Menu">…</Offcanvas>
 * ```
 */
export function Offcanvas({
  open,
  onClose,
  placement = 'start',
  title,
  children,
  className,
}: OffcanvasProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Keep the panel mounted through its slide-out; the panel's animation end
  // drives unmount (honors the motion tier automatically).
  const { isPresent, state, ref: presenceRef } = usePresence(open);

  useFocusTrap(panelRef, open);
  useScrollLock(open);
  // Escape + backdrop (outside) click both dismiss, handled in one hook.
  useDismiss(panelRef, open, onClose, { outsideClick: true });

  if (!mounted || !isPresent) return null;

  const panelAnim = open ? ENTER_ANIM[placement] : EXIT_ANIM[placement];

  return createPortal(
    <div
      className={cx('lily-backdrop', 'lily-animate', `lily-animate--${open ? 'fade-in' : 'fade-out'}`, 'lily-animate--snappy')}
      data-state={state}
    >
      <div
        ref={mergeRefs(panelRef, presenceRef)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        data-state={state}
        className={cx(CLASS, `${CLASS}--${placement}`, 'lily-animate', `lily-animate--${panelAnim}`, 'lily-animate--snappy', className)}
      >
        <div className={`${CLASS}__header`}>
          {title && (
            <h2 id={titleId} className={`${CLASS}__title`}>
              {title}
            </h2>
          )}
          <CloseButton onClick={onClose} />
        </div>
        <div className={`${CLASS}__body`}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
