import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

/** Default icons for each status (text glyphs — no color-only meaning). */
const DEFAULT_ICONS: Record<ResultStatus, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  '404': '?',
  '403': '⊘',
  '500': '☇',
};

/** Default screen-reader labels for each status. */
const STATUS_LABELS: Record<ResultStatus, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  '404': 'not found',
  '403': 'forbidden',
  '500': 'server error',
};

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Semantic status. Controls the icon and (via CSS) the icon color. */
  status: ResultStatus;
  /** Short heading. */
  title: ReactNode;
  /** Supporting description. */
  description?: ReactNode;
  /** Custom icon; defaults to the built-in status glyph. */
  icon?: ReactNode;
  /** Action buttons/links placed below the description. */
  children?: ReactNode;
}

/**
 * Result — a feedback block that reports the outcome of an operation.
 * Each status has a distinct icon so meaning is not conveyed by color alone.
 *
 * @example
 * ```tsx
 * <Result status="success" title="送信完了" description="メッセージを受け付けました。">
 *   <Button status="primary">トップへ戻る</Button>
 * </Result>
 * ```
 */
export const Result = forwardRef<HTMLDivElement, ResultProps>(function Result(
  { status, title, description, icon, children, className, ...rest },
  ref,
) {
  const defaultIcon = DEFAULT_ICONS[status];
  const statusLabel = STATUS_LABELS[status];

  return (
    <div
      ref={ref}
      className={cx('lily-result', `lily-result--${status}`, className)}
      {...rest}
    >
      {icon ? (
        <span className="lily-result__icon">{icon}</span>
      ) : (
        <span className="lily-result__icon" role="img" aria-label={statusLabel}>
          {defaultIcon}
        </span>
      )}
      <p className="lily-result__title">{title}</p>
      {description && <p className="lily-result__description">{description}</p>}
      {children && <div className="lily-result__actions">{children}</div>}
    </div>
  );
});
