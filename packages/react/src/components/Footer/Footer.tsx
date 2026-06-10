import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer content (links, legal text, columns — composed freely). */
  children: ReactNode;
  /** Draw a top border separating the footer from the page. @default true */
  bordered?: boolean;
}

const CLASS = 'lily-footer';

/**
 * Footer — the page's `contentinfo` landmark. The counterpart to {@link Navbar}:
 * a `<footer>` region with a centered inner row you compose freely (links,
 * legal text, columns).
 *
 * @example
 * ```tsx
 * <Footer>
 *   <p>© 2026 Lily</p>
 *   <a href="/terms">Terms</a>
 * </Footer>
 * ```
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { children, bordered = true, className, ...rest },
  ref,
) {
  return (
    <footer
      ref={ref}
      className={cx(CLASS, bordered && `${CLASS}--bordered`, className)}
      {...rest}
    >
      <div className={`${CLASS}__inner`}>{children}</div>
    </footer>
  );
});
