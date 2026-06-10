import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconTone = 'default' | 'primary' | 'accent' | 'muted' | 'danger' | 'success' | 'warning' | 'info';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Size token (sets `font-size`; the icon is `1em` square). @default 'md' */
  size?: IconSize;
  /** Semantic color (uses the AAA `*-text` tokens). @default 'default' (currentColor) */
  tone?: IconTone;
  /**
   * Accessible label. When set, the icon is meaningful (`role="img"`);
   * otherwise it is decorative and hidden from assistive tech.
   */
  label?: string;
  /** The icon glyph — typically an inline `<svg>`. */
  children?: ReactNode;
}

/**
 * Icon — a sizing/color wrapper around any inline SVG or glyph. Lily ships no
 * icon set; bring your own and let this normalize size and tint via tokens.
 *
 * @example
 * ```tsx
 * <Icon size="lg" tone="primary" label="検索"><SearchSvg /></Icon>
 * <Icon aria-hidden><ChevronSvg /></Icon> // decorative
 * ```
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { size = 'md', tone = 'default', label, className, children, ...rest },
  ref,
) {
  const classes = cx('lily-icon', size !== 'md' && `lily-icon--${size}`, className);
  return (
    <span
      ref={ref}
      className={classes}
      data-tone={tone !== 'default' ? tone : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {children}
    </span>
  );
});
