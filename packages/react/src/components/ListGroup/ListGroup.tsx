import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

const CLASS = 'lily-list-group';

export interface ListGroupProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

/** ListGroup — a series of content items. Compose with `ListGroup.Item`. */
const ListGroupRoot = forwardRef<HTMLUListElement, ListGroupProps>(function ListGroup(
  { className, children, ...rest },
  ref,
) {
  return (
    <ul ref={ref} className={cx(CLASS, className)} {...rest}>
      {children}
    </ul>
  );
});

export interface ListGroupItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Render as an interactive item (hover/focus affordances). @default false */
  action?: boolean;
  /** Mark as the current/active item. @default false */
  active?: boolean;
  /** Disable the item. @default false */
  disabled?: boolean;
}

const ListGroupItem = forwardRef<HTMLLIElement, ListGroupItemProps>(function ListGroupItem(
  { action = false, active = false, disabled = false, className, children, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      className={cx(`${CLASS}__item`, action && `${CLASS}__item--action`, className)}
      {...(active ? { 'aria-current': true } : {})}
      {...(disabled ? { 'aria-disabled': true } : {})}
      {...rest}
    >
      {children}
    </li>
  );
});

ListGroupItem.displayName = 'ListGroup.Item';

/**
 * ListGroup — a flexible series of content items.
 *
 * @example
 * ```tsx
 * <ListGroup>
 *   <ListGroup.Item active>One</ListGroup.Item>
 *   <ListGroup.Item>Two</ListGroup.Item>
 *   <ListGroup.Item disabled>Three</ListGroup.Item>
 * </ListGroup>
 * ```
 */
export const ListGroup = Object.assign(ListGroupRoot, { Item: ListGroupItem });
