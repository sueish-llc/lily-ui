import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { prefersReducedMotion } from '../../motion/level';

export interface BackTopProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Scroll distance (px) before the button appears. @default 400 */
  visibilityHeight?: number;
  /** Accessible label. @default 'Back to top' */
  label?: string;
  /** Custom icon (defaults to an up arrow). */
  children?: ReactNode;
}

/**
 * BackTop — a floating button that appears after scrolling past
 * `visibilityHeight` and smoothly returns to the top. Respects reduced motion.
 *
 * @example
 * ```tsx
 * <BackTop label="トップへ戻る" />
 * ```
 */
export const BackTop = forwardRef<HTMLButtonElement, BackTopProps>(function BackTop(
  { visibilityHeight = 400, label = 'Back to top', className, children, onClick, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > visibilityHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visibilityHeight]);

  return (
    <button
      ref={ref}
      type="button"
      className={cx('lily-back-top', className)}
      aria-label={label}
      hidden={!visible}
      onClick={(e) => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        onClick?.(e);
      }}
      {...rest}
    >
      {children ?? (
        <span aria-hidden="true">↑</span>
      )}
    </button>
  );
});
