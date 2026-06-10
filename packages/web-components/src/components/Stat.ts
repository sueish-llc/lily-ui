import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type StatTrend = 'up' | 'down' | 'neutral';

/**
 * `<lily-stat>` — a KPI tile (label, value, optional trend delta). The delta
 * pairs an arrow with a status color and visually-hidden text.
 *
 * Attributes: `label`, `value`, `delta`, `trend`, `help`, `up-label`, `down-label`.
 */
export class LilyStat extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label', 'value', 'delta', 'trend', 'help', 'up-label', 'down-label'];
  }

  protected build(): BuildResult {
    const trend = this.attr('trend', 'neutral') as StatTrend;
    const delta = this.attr('delta');
    const help = this.attr('help');
    const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '';

    const root = h('div', { class: 'lily-stat' });
    root.appendChild(h('span', { class: 'lily-stat__label', text: this.attr('label', '')! }));
    root.appendChild(h('span', { class: 'lily-stat__value', text: this.attr('value', '')! }));
    if (delta != null) {
      const d = h('span', { class: ['lily-stat__delta', trend !== 'neutral' && `lily-stat__delta--${trend}`] });
      if (arrow) d.appendChild(h('span', { class: 'lily-stat__arrow', attrs: { 'aria-hidden': 'true' }, text: arrow }));
      if (trend !== 'neutral') {
        const word = trend === 'up' ? this.attr('up-label', 'increase')! : this.attr('down-label', 'decrease')!;
        d.appendChild(h('span', { class: 'lily-visually-hidden', text: `${word}: ` }));
      }
      d.appendChild(document.createTextNode(delta));
      root.appendChild(d);
    }
    if (help != null) root.appendChild(h('span', { class: 'lily-stat__help', text: help }));

    return { root, slot: null };
  }
}
