import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';

export interface VisuallyHiddenOwnProps {
  /**
   * When true, the element becomes visible on focus — useful when it wraps a
   * focusable element (e.g. a skip-navigation link).
   * @default false
   */
  focusable?: boolean;
}

const DEFAULT_TAG = 'span' as const;

/**
 * VisuallyHidden — hides content visually while keeping it available to
 * assistive technologies (the classic sr-only technique).
 *
 * Renders a `<span>` by default; the `as` prop makes it polymorphic. When
 * `focusable` is set the content reappears on `:focus` so skip links and
 * focusable helpers remain operable by keyboard.
 *
 * @example
 * ```tsx
 * // Screen-reader label
 * <VisuallyHidden>Loading…</VisuallyHidden>
 *
 * // Skip link (visible on focus)
 * <VisuallyHidden as="a" focusable href="#main">Skip to content</VisuallyHidden>
 * ```
 */
function VisuallyHiddenImpl<C extends ElementType = typeof DEFAULT_TAG>(
  {
    as,
    focusable = false,
    className,
    children,
    ...rest
  }: PolymorphicProps<C, VisuallyHiddenOwnProps> & { className?: string },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  return (
    <Tag
      ref={ref}
      className={cx(
        'lily-visually-hidden',
        focusable && 'lily-visually-hidden--focusable',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const VisuallyHidden = forwardRef(VisuallyHiddenImpl) as <
  C extends ElementType = typeof DEFAULT_TAG,
>(
  props: PolymorphicProps<C, VisuallyHiddenOwnProps> & {
    className?: string;
    ref?: React.Ref<Element>;
  },
) => React.ReactElement;
