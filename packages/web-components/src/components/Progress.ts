import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-progress>` — a determinate progress bar.
 *
 * Exposes `role="progressbar"` with `aria-valuenow/min/max` for screen readers.
 * Binds `--lily-progress-value` on the inner bar so CSS can animate the fill.
 *
 * Attributes: `value`, `min`, `max`, `striped`, `show-label`, `label`.
 *
 * @example
 * ```html
 * <lily-progress value="60" label="Upload progress" show-label></lily-progress>
 * ```
 */
export class LilyProgress extends LilyElement {
  static get observedAttributes(): string[] {
    return ['value', 'min', 'max', 'striped', 'show-label', 'label'];
  }

  protected build(): BuildResult {
    const CLASS = 'lily-progress';
    const value = this.numAttr('value', 0);
    const min = this.numAttr('min', 0);
    const max = this.numAttr('max', 100);
    const striped = this.boolAttr('striped');
    const showLabel = this.boolAttr('show-label');
    const label = this.attr('label');

    const clamped = Math.min(max, Math.max(min, value));
    const percent = max === min ? 0 : Math.round(((clamped - min) / (max - min)) * 100);

    const root = h('div', {
      class: [CLASS, striped && `${CLASS}--striped`],
      attrs: {
        role: 'progressbar',
        'aria-valuenow': clamped,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-label': label ?? null,
      },
    });

    const bar = h('div', { class: `${CLASS}__bar` });
    bar.style.setProperty('--lily-progress-value', String(percent));
    if (showLabel) bar.textContent = `${percent}%`;
    root.appendChild(bar);

    return { root, slot: null };
  }
}
