import { forwardRef } from 'react';
import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

/** Avatar size, mapped to the control-height tokens. */
export type AvatarSize = 'sm' | 'md' | 'lg';
/** Presence/status conveyed by the corner dot. */
export type AvatarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Derive up to two uppercase initials from a display name. */
function initialsOf(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. When set, shows the photo; otherwise initials/children render. */
  src?: string;
  /** Display name — provides the accessible label and derives the initials. */
  name?: string;
  /** Alternative accessible name when `name` is not the photo subject. */
  alt?: string;
  /** Size token. @default 'md' */
  size?: AvatarSize;
  /** Rounded-square instead of a circle. @default false */
  square?: boolean;
  /** Presence dot. */
  status?: AvatarStatus;
  /** Text describing the status dot, so the meaning is not color-only. */
  statusLabel?: string;
  /** Extra props forwarded to the inner `<img>`. */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
  children?: ReactNode;
}

/**
 * Avatar — a user/entity thumbnail with image, initials fallback, and an
 * optional presence dot.
 *
 * The accessible name combines `name`/`alt` with the status label (e.g.
 * "Ada Lovelace, online"), so the dot never conveys meaning by color alone.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src="/ada.jpg" status="success" statusLabel="online" />
 * <Avatar name="Grace Hopper" /> // initials "GH"
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, alt, size = 'md', square = false, status, statusLabel, imgProps, className, children, ...rest },
  ref,
) {
  const classes = cx(
    'lily-avatar',
    size !== 'md' && `lily-avatar--${size}`,
    square && 'lily-avatar--square',
    className,
  );
  const labelParts = [name ?? alt, status ? (statusLabel ?? status) : null].filter(Boolean) as string[];
  const label = labelParts.length > 0 ? labelParts.join(', ') : undefined;

  return (
    <span ref={ref} className={classes} role={label ? 'img' : undefined} aria-label={label} {...rest}>
      {src ? (
        <img className="lily-avatar__img" src={src} alt="" aria-hidden="true" {...imgProps} />
      ) : (
        <span aria-hidden="true">{children ?? initialsOf(name ?? alt)}</span>
      )}
      {status && <span className="lily-avatar__status" data-status={status} aria-hidden="true" />}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * AvatarGroup — overlap a row of {@link Avatar}s. To show an overflow count,
 * append a final `<Avatar>` with the count (e.g. `<Avatar name="+3">+3</Avatar>`).
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('lily-avatar-group', className)} {...rest}>
      {children}
    </div>
  );
});
