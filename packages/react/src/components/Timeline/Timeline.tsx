import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type TimelineStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface TimelineItem {
  /** Event title. */
  title: ReactNode;
  /** Timestamp / meta text. */
  time?: ReactNode;
  /** Longer description. */
  description?: ReactNode;
  /** Dot color. @default 'neutral' */
  status?: TimelineStatus;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** Events in order. */
  items: TimelineItem[];
}

/**
 * Timeline — a vertical list of events (history / activity feed). Each item has
 * a status dot, a title, an optional time, and a description.
 *
 * @example
 * ```tsx
 * <Timeline items={[{ title: '注文', time: '10:00', status: 'success' }]} />
 * ```
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, className, ...rest },
  ref,
) {
  return (
    <ol ref={ref} className={cx('lily-timeline', className)} {...rest}>
      {items.map((item, i) => (
        <li key={i} className="lily-timeline__item">
          <span
            className="lily-timeline__dot"
            data-status={item.status && item.status !== 'neutral' ? item.status : undefined}
            aria-hidden="true"
          />
          <div className="lily-timeline__content">
            <p className="lily-timeline__title">{item.title}</p>
            {item.time != null && <span className="lily-timeline__time">{item.time}</span>}
            {item.description != null && <p className="lily-timeline__description">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
});
