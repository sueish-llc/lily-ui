import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type DescriptionsLayout = 'horizontal' | 'vertical';
export type DescriptionsColumns = 1 | 2 | 3;

export interface DescriptionsItemProps {
  /** The label (term) for this item. */
  term: ReactNode;
  /** The content (detail) for this item. */
  children: ReactNode;
}

/**
 * DescriptionsItem — a single key/value pair inside `Descriptions`.
 *
 * @example
 * ```tsx
 * <DescriptionsItem term="Name">Lily UI</DescriptionsItem>
 * ```
 */
export const DescriptionsItem = forwardRef<HTMLDivElement, DescriptionsItemProps & HTMLAttributes<HTMLDivElement>>(
  function DescriptionsItem({ term, children, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx('lily-descriptions__item', className)} {...rest}>
        <dt className="lily-descriptions__term">{term}</dt>
        <dd className="lily-descriptions__detail">{children}</dd>
      </div>
    );
  },
);

export interface DescriptionsProps extends HTMLAttributes<HTMLDListElement> {
  /** Number of columns (pairs per row). @default 1 */
  columns?: DescriptionsColumns;
  /** Layout direction. @default 'horizontal' */
  layout?: DescriptionsLayout;
  /** Show a bordered grid. @default false */
  bordered?: boolean;
  children: ReactNode;
}

/**
 * Descriptions — a key/value definition list rendered as `<dl>`.
 * Compose with `DescriptionsItem` children.
 *
 * @example
 * ```tsx
 * <Descriptions columns={2} bordered>
 *   <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
 *   <DescriptionsItem term="Author">Lily UI</DescriptionsItem>
 * </Descriptions>
 * ```
 */
export const Descriptions = forwardRef<HTMLDListElement, DescriptionsProps>(function Descriptions(
  { columns = 1, layout = 'horizontal', bordered = false, className, children, ...rest },
  ref,
) {
  return (
    <dl
      ref={ref}
      className={cx(
        'lily-descriptions',
        `lily-descriptions--${layout}`,
        `lily-descriptions--cols-${columns}`,
        bordered && 'lily-descriptions--bordered',
        className,
      )}
      {...rest}
    >
      {children}
    </dl>
  );
});
