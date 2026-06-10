import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type TimelineStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export interface TimelineItem {
  title: string;
  time?: string;
  description?: string;
  status?: TimelineStatus;
}

/**
 * `<lily-timeline>` — a vertical list of events. Items are a JSON `items`
 * attribute (`{ title, time?, description?, status? }`).
 *
 * Attributes: `items`.
 */
export class LilyTimeline extends LilyElement {
  static get observedAttributes(): string[] {
    return ['items'];
  }

  private parse(): TimelineItem[] {
    const raw = this.attr('items');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as TimelineItem[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const root = h('ol', { class: 'lily-timeline' });
    for (const item of this.parse()) {
      const li = h('li', { class: 'lily-timeline__item' });
      li.appendChild(
        h('span', {
          class: 'lily-timeline__dot',
          attrs: { 'data-status': item.status && item.status !== 'neutral' ? item.status : null, 'aria-hidden': 'true' },
        }),
      );
      const content = h('div', { class: 'lily-timeline__content' });
      content.appendChild(h('p', { class: 'lily-timeline__title', text: item.title }));
      if (item.time != null) content.appendChild(h('span', { class: 'lily-timeline__time', text: item.time }));
      if (item.description != null) content.appendChild(h('p', { class: 'lily-timeline__description', text: item.description }));
      li.appendChild(content);
      root.appendChild(li);
    }
    return { root, slot: null };
  }
}
