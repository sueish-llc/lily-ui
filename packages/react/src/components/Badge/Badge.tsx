import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';

/** Semantic intent, mapped to theme color tokens. */
export type BadgeStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';

export interface BadgeOwnProps {
  /** Semantic color. @default 'primary' */
  status?: BadgeStatus;
  /** Soft/subtle appearance. @default false */
  subtle?: boolean;
  /** Fully rounded pill shape. @default false */
  pill?: boolean;
}

const CLASS = 'lily-badge';
const DEFAULT_TAG = 'span' as const;

/**
 * Badge — a small, static count or label. For an interactive token — selectable
 * (filter) or removable (input) — use `Chip` instead.
 *
 * For a standalone status conveyed only by color, include descriptive text
 * (e.g. a visually-hidden suffix) so it isn't color-only.
 *
 * @example
 * ```tsx
 * <Badge status="danger" pill>9</Badge>
 * <Badge status="success" subtle>Active</Badge>
 * ```
 */
function BadgeImpl<C extends ElementType = typeof DEFAULT_TAG>(
  { as, status = 'primary', subtle = false, pill = false, className, children, ...rest }: PolymorphicProps<C, BadgeOwnProps> & {
    className?: string;
  },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  const classes = cx(CLASS, subtle && `${CLASS}--subtle`, pill && `${CLASS}--pill`, className);
  return (
    <Tag ref={ref} className={classes} data-status={status} {...rest}>
      {children}
    </Tag>
  );
}

export const Badge = forwardRef(BadgeImpl) as <C extends ElementType = typeof DEFAULT_TAG>(
  props: PolymorphicProps<C, BadgeOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;
