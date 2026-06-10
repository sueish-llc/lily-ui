import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Shape. @default 'text' */
  variant?: SkeletonVariant;
  /** CSS width (e.g. '60%', 200). */
  width?: number | string;
  /** CSS height (e.g. '1rem', 40). */
  height?: number | string;
  /** Render N stacked text lines (text variant only). */
  lines?: number;
  /** Shimmer animation. @default true */
  animated?: boolean;
}

const dim = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v);

/**
 * Skeleton — the loading-placeholder primitive. Renders text / circle / rect
 * shapes (and multi-line text) with a shimmer, replacing content while it loads.
 * Decorative (`aria-hidden`); pair with a live "loading" announcement in your
 * view. The shimmer is disabled under `prefers-reduced-motion`.
 *
 * This is the single loading-placeholder component (it supersedes the former
 * Bootstrap-style `Placeholder`). For a solid block, use `variant="rect"`.
 *
 * @example
 * ```tsx
 * <Skeleton variant="circle" width={40} height={40} />
 * <Skeleton variant="rect" width="70%" height="1rem" />
 * <Skeleton lines={3} />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines, animated = true, className, style, ...rest },
  ref,
) {
  if (variant === 'text' && lines && lines > 1) {
    return (
      <div ref={ref} className={className} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={cx('lily-skeleton', 'lily-skeleton--text', animated && 'lily-skeleton--animated')}
            style={{ width: i === lines - 1 ? '70%' : dim(width) ?? '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={cx('lily-skeleton', `lily-skeleton--${variant}`, animated && 'lily-skeleton--animated', className)}
      style={{ width: dim(width), height: dim(height), ...style } as CSSProperties}
      aria-hidden="true"
      {...(rest as object)}
    />
  );
});
