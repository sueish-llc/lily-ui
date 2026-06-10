import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';

/** Visual emphasis of the button. */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
/** Semantic intent, mapped to theme color tokens. */
export type ButtonStatus = 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
/** Control size. */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOwnProps {
  /** Visual style. @default 'solid' */
  variant?: ButtonVariant;
  /** Semantic intent / color. @default 'primary' */
  status?: ButtonStatus;
  /** Size. @default 'md' */
  size?: ButtonSize;
  /** Stretch to fill the container width. @default false */
  block?: boolean;
  /** Show a spinner and disable interaction. @default false */
  loading?: boolean;
  /** Accessible label announced while `loading` is true. @default 'Loading' */
  loadingLabel?: string;
  /** Icon rendered before the label. */
  startIcon?: ReactNode;
  /** Icon rendered after the label. */
  endIcon?: ReactNode;
  /** Disable the button. */
  disabled?: boolean;
}

const CLASS = 'lily-button';
const DEFAULT_TAG = 'button' as const;

/**
 * Button — the primary action control.
 *
 * Styling comes from `@lily-ui/css` (import `@lily-ui/css/styles` once in your
 * app). This component renders the correct markup, class names, and ARIA state.
 *
 * Accessibility:
 * - Renders a native `<button>` by default (full keyboard + screen-reader support).
 * - When rendered as another element via `as`, pass an interactive element
 *   (e.g. `as="a"` with `href`).
 * - `loading` sets `aria-busy` and exposes an accessible loading label.
 *
 * @example
 * ```tsx
 * <Button status="danger" variant="outline" onClick={remove}>Delete</Button>
 * <Button as="a" href="/docs">Read the docs</Button>
 * ```
 */
function ButtonImpl<C extends ElementType = typeof DEFAULT_TAG>(
  {
    as,
    variant = 'solid',
    status = 'primary',
    size = 'md',
    block = false,
    loading = false,
    loadingLabel = 'Loading',
    startIcon,
    endIcon,
    disabled,
    className,
    children,
    ...rest
  }: PolymorphicProps<C, ButtonOwnProps> & { className?: string },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  const isNativeButton = Tag === 'button';
  const isDisabled = disabled || loading;

  const classes = cx(
    CLASS,
    `${CLASS}--${variant}`,
    `${CLASS}--${size}`,
    block && `${CLASS}--block`,
    className,
  );

  return (
    <Tag
      ref={ref}
      className={classes}
      data-status={status}
      aria-busy={loading || undefined}
      // Native buttons use `disabled`; other elements use aria-disabled so the
      // state is still conveyed to assistive technology.
      {...(isNativeButton
        ? { type: (rest as { type?: string }).type ?? 'button', disabled: isDisabled }
        : { 'aria-disabled': isDisabled || undefined })}
      {...rest}
    >
      {loading && <span className={`${CLASS}__spinner`} aria-hidden="true" />}
      {!loading && startIcon && <span aria-hidden="true">{startIcon}</span>}
      {children}
      {!loading && endIcon && <span aria-hidden="true">{endIcon}</span>}
      {loading && <span className="lily-visually-hidden">{loadingLabel}</span>}
    </Tag>
  );
}

export const Button = forwardRef(ButtonImpl) as <C extends ElementType = typeof DEFAULT_TAG>(
  props: PolymorphicProps<C, ButtonOwnProps> & {
    className?: string;
    ref?: React.Ref<Element>;
  },
) => React.ReactElement;
