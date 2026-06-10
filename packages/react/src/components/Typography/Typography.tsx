import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';

/** Text role presets — one right answer for size/leading/weight. */
export type TextVariant = 'body' | 'lead' | 'small' | 'label' | 'caption' | 'overline';
/** Colored-text role; non-default tones use the AAA `*-text` tokens. */
export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'primary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

export interface TextOwnProps {
  /** Role preset. @default 'body' */
  variant?: TextVariant;
  /** Color role. @default 'default' */
  tone?: TextTone;
  /** Truncate to a single line with an ellipsis. @default false */
  truncate?: boolean;
}

const TEXT_TAG = 'p' as const;

/**
 * Text — body/label/caption typography with semantic tone. Renders a `<p>` by
 * default; change the element with `as` (e.g. `as="span"`).
 *
 * @example
 * ```tsx
 * <Text variant="lead">導入の一文。</Text>
 * <Text as="span" variant="caption" tone="muted">補足</Text>
 * ```
 */
function TextImpl<C extends ElementType = typeof TEXT_TAG>(
  { as, variant = 'body', tone = 'default', truncate = false, className, children, ...rest }: PolymorphicProps<C, TextOwnProps> & {
    className?: string;
  },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? TEXT_TAG) as ElementType;
  const classes = cx(
    'lily-text',
    variant !== 'body' && `lily-text--${variant}`,
    truncate && 'lily-text--truncate',
    className,
  );
  return (
    <Tag ref={ref} className={classes} data-tone={tone !== 'default' ? tone : undefined} {...rest}>
      {children}
    </Tag>
  );
}

export const Text = forwardRef(TextImpl) as <C extends ElementType = typeof TEXT_TAG>(
  props: PolymorphicProps<C, TextOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOwnProps {
  /** Semantic heading level; also the default visual size. @default 2 */
  level?: HeadingLevel;
  /** Oversized hero/display scale (independent of level). @default false */
  display?: boolean;
  /** Paint the text with the signature primary gradient. @default false */
  gradient?: boolean;
}

/**
 * Heading — `h1`–`h6` with a token-driven scale. `level` sets semantics and the
 * default size; `display` opts into the oversized hero scale, and `as` lets you
 * decouple the rendered tag from the visual level.
 *
 * @example
 * ```tsx
 * <Heading level={1} display>ようこそ</Heading>
 * <Heading level={3} as="h2">セクション</Heading>
 * ```
 */
function HeadingImpl<C extends ElementType = 'h2'>(
  { as, level = 2, display = false, gradient = false, className, children, ...rest }: PolymorphicProps<C, HeadingOwnProps> & {
    className?: string;
  },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? (`h${level}` as ElementType)) as ElementType;
  const classes = cx(
    'lily-heading',
    display ? 'lily-heading--display' : `lily-heading--${level}`,
    gradient && 'lily-heading--gradient',
    className,
  );
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export const Heading = forwardRef(HeadingImpl) as <C extends ElementType = 'h2'>(
  props: PolymorphicProps<C, HeadingOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;
