import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type MeterStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * `<lily-meter>` — a static scalar measurement within a known range
 * (`role="meter"`). Distinct from `<lily-progress>` (task completion).
 *
 * Attributes: `value`, `min`, `max`, `label`, `status`, `value-text`, `show-value`.
 */
export class LilyMeter extends LilyElement {
  static get observedAttributes(): string[] {
    return ['value', 'min', 'max', 'label', 'status', 'value-text', 'show-value'];
  }

  protected build(): BuildResult {
    const value = this.numAttr('value', 0);
    const min = this.numAttr('min', 0);
    const max = this.numAttr('max', 100);
    const status = this.attr('status', 'primary')!;
    const label = this.attr('label');
    const valueText = this.attr('value-text');
    const showValue = this.boolAttr('show-value');
    const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    const root = h('div', { class: 'lily-meter' });
    if (label != null || showValue) {
      const header = h('div', { class: 'lily-meter__header' });
      header.appendChild(label != null ? h('span', { text: label }) : h('span'));
      if (showValue) header.appendChild(h('span', { class: 'lily-meter__value', text: valueText ?? String(value) }));
      root.appendChild(header);
    }

    const track = h('div', {
      class: 'lily-meter__track',
      attrs: {
        role: 'meter',
        'aria-valuenow': value,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': valueText ?? null,
        'aria-label': label ?? null,
      },
    });
    const fill = h('div', {
      class: 'lily-meter__fill',
      attrs: { 'data-status': status !== 'primary' ? status : null },
    });
    fill.style.width = `${pct}%`;
    track.appendChild(fill);
    root.appendChild(track);

    return { root, slot: null };
  }
}
