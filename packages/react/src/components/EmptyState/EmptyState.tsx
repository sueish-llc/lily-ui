import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Short heading. */
  title: ReactNode;
  /** Supporting description. */
  description?: ReactNode;
  /** Decorative icon/illustration. */
  icon?: ReactNode;
  /** Action buttons/links. */
  actions?: ReactNode;
}

/**
 * EmptyState — a centered placeholder for empty lists, no search results, or
 * errors, with an icon, title, description, and optional actions.
 *
 * @example
 * ```tsx
 * <EmptyState icon={<InboxIcon />} title="まだ何もありません" description="最初の項目を追加しましょう。"
 *   actions={<Button>追加</Button>} />
 * ```
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, actions, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('lily-empty-state', className)} {...rest}>
      {icon && (
        <span className="lily-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="lily-empty-state__title">{title}</p>
      {description && <p className="lily-empty-state__description">{description}</p>}
      {actions && <div className="lily-empty-state__actions">{actions}</div>}
    </div>
  );
});
