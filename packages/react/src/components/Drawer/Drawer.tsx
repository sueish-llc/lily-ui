import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useFocusTrap, useDismiss, useScrollLock, usePresence } from '../../hooks';
import { CloseButton } from '../CloseButton';
import type { AnimationName } from '../../motion/animations';

/** How the drawer relates to the rest of the page. */
export type DrawerVariant = 'temporary' | 'persistent' | 'permanent';
/** Edge the drawer is anchored to. */
export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

/** Slide animation per edge (temporary only) — enter slides in, exit reverses. */
const ENTER_ANIM: Record<DrawerAnchor, AnimationName> = {
  left: 'slide-in-left',
  right: 'slide-in-right',
  top: 'slide-in-down',
  bottom: 'slide-in-up',
};
const EXIT_ANIM: Record<DrawerAnchor, AnimationName> = {
  left: 'slide-out-left',
  right: 'slide-out-right',
  top: 'slide-out-up',
  bottom: 'slide-out-down',
};

export interface DrawerProps {
  /**
   * Whether the drawer is open. Required for `temporary`/`persistent`; ignored
   * for `permanent` (always shown). @default false
   */
  open?: boolean;
  /** Called when the drawer requests to close (Escape / backdrop — temporary). */
  onClose?: () => void;
  /** Relationship to the page. @default 'temporary' */
  variant?: DrawerVariant;
  /** Edge to anchor to. @default 'left' */
  anchor?: DrawerAnchor;
  /** Visible title; also becomes the dialog's accessible name (temporary). */
  title?: ReactNode;
  /**
   * Accessible name when there is no visible `title` (e.g. a navigation drawer).
   * Applied as `aria-label`.
   */
  ariaLabel?: string;
  /** Drawer content. */
  children: ReactNode;
  className?: string;
}

const CLASS = 'lily-drawer';

/**
 * Drawer — a panel anchored to a screen edge, in one of three variants:
 *
 * - **temporary** (default): overlays the page on a backdrop with a focus trap,
 *   scroll lock, and Escape/backdrop dismissal — the {@link Modal} a11y model.
 * - **persistent**: sits in the normal flow and collapses open/closed, pushing
 *   sibling content aside.
 * - **permanent**: always visible, in the normal flow (e.g. a desktop sidebar).
 *
 * A common responsive pattern is `permanent` on wide screens and `temporary` on
 * narrow ones.
 *
 * @example
 * ```tsx
 * <Drawer open={open} onClose={close} anchor="left" title="Menu">…</Drawer>
 * <Drawer variant="permanent" anchor="left" ariaLabel="Sections">…</Drawer>
 * ```
 */
export function Drawer({
  open = false,
  onClose,
  variant = 'temporary',
  anchor = 'left',
  title,
  ariaLabel,
  children,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isOverlay = variant === 'temporary';

  // Hooks must run unconditionally; they no-op when not an open overlay.
  const overlayOpen = isOverlay && open;
  const { isPresent, state, ref: presenceRef } = usePresence(overlayOpen);
  useFocusTrap(panelRef, overlayOpen);
  useScrollLock(overlayOpen);
  useDismiss(panelRef, overlayOpen, () => onClose?.(), { outsideClick: true });

  const anchorClass = `${CLASS}--${anchor}`;
  const hasTitle = title != null && title !== '';

  // ── In-flow variants (permanent / persistent): no portal, no trap ─────────
  if (!isOverlay) {
    return (
      <div
        ref={panelRef}
        aria-label={ariaLabel}
        aria-labelledby={hasTitle ? titleId : undefined}
        data-open={variant === 'persistent' ? String(open) : undefined}
        className={cx(CLASS, `${CLASS}--${variant}`, anchorClass, className)}
      >
        {(hasTitle || (onClose && variant === 'persistent')) && (
          <div className={`${CLASS}__header`}>
            {hasTitle && (
              <h2 id={titleId} className={`${CLASS}__title`}>
                {title}
              </h2>
            )}
            {onClose && variant === 'persistent' && <CloseButton onClick={onClose} />}
          </div>
        )}
        <div className={`${CLASS}__body`}>{children}</div>
      </div>
    );
  }

  // ── Temporary overlay ──────────────────────────────────────────────────────
  if (!mounted || !isPresent) return null;

  const panelAnim = open ? ENTER_ANIM[anchor] : EXIT_ANIM[anchor];

  return createPortal(
    <div
      className={cx(
        'lily-backdrop',
        'lily-animate',
        `lily-animate--${open ? 'fade-in' : 'fade-out'}`,
        'lily-animate--snappy',
      )}
      data-state={state}
    >
      <div
        ref={mergeRefs(panelRef, presenceRef)}
        role="dialog"
        aria-modal="true"
        aria-label={!hasTitle ? ariaLabel : undefined}
        aria-labelledby={hasTitle ? titleId : undefined}
        data-state={state}
        className={cx(
          CLASS,
          `${CLASS}--temporary`,
          anchorClass,
          'lily-animate',
          `lily-animate--${panelAnim}`,
          'lily-animate--snappy',
          className,
        )}
      >
        <div className={`${CLASS}__header`}>
          {hasTitle && (
            <h2 id={titleId} className={`${CLASS}__title`}>
              {title}
            </h2>
          )}
          <CloseButton onClick={() => onClose?.()} />
        </div>
        <div className={`${CLASS}__body`}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
