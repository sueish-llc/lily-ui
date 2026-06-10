import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type LinkStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Color role. @default 'primary' */
  status?: LinkStatus;
  /** Inherit text color until hover (for links inside dense copy). @default false */
  quiet?: boolean;
  /**
   * Mark as opening in a new tab: sets `target`/`rel`, shows an outward-arrow
   * affordance, and appends a visually-hidden "(opens in new tab)" hint.
   */
  external?: boolean;
  children?: ReactNode;
}

/**
 * Link — a styled anchor using the AAA `*-text` color tokens with a visible
 * focus ring.
 *
 * @example
 * ```tsx
 * <Link href="/docs">ドキュメント</Link>
 * <Link href="https://example.com" external>外部サイト</Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { status = 'primary', quiet = false, external = false, className, children, target, rel, ...rest },
  ref,
) {
  const classes = cx('lily-link', quiet && 'lily-link--quiet', external && 'lily-link--external', className);
  return (
    <a
      ref={ref}
      className={classes}
      data-status={status !== 'primary' ? status : undefined}
      target={external ? (target ?? '_blank') : target}
      rel={external ? (rel ?? 'noopener noreferrer') : rel}
      {...rest}
    >
      {children}
      {external && <span className="lily-visually-hidden"> (opens in new tab)</span>}
    </a>
  );
});
