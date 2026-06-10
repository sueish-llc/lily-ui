import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface BreadcrumbItem {
  /** Visible label. */
  label: ReactNode;
  /** Link target; omit for the current (last) page. */
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Ordered crumbs from root to current page. */
  items: BreadcrumbItem[];
  /** Divider glyph between crumbs. @default '/' */
  divider?: string;
  /** Accessible label for the nav landmark. @default 'Breadcrumb' */
  label?: string;
}

const CLASS = 'lily-breadcrumb';

/**
 * Breadcrumb — shows the current page's location in the hierarchy.
 *
 * Renders a `<nav>` landmark with an ordered list; the last item is marked
 * `aria-current="page"` and rendered as plain text.
 *
 * @example
 * ```tsx
 * <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Library' }]} />
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, divider = '/', label = 'Breadcrumb', className, style, ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ol
        className={CLASS}
        style={{ ['--lily-breadcrumb-divider' as string]: `'${divider}'`, ...style }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={i}
              className={`${CLASS}__item`}
              {...(isLast ? { 'aria-current': 'page' as const } : {})}
            >
              {item.href && !isLast ? (
                <a className={`${CLASS}__link`} href={item.href}>
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
