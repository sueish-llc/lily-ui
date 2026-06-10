import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

const STAR = '★';

/**
 * `<lily-rating>` — a star rating. Interactive by default (native radios →
 * arrow-key support); `read-only` renders a labeled display. Dispatches a
 * `change` event whose `detail` is the selected rating.
 *
 * Attributes: `value`, `max`, `name`, `size`, `read-only`, `disabled`, `label`.
 */
export class LilyRating extends LilyElement {
  private nameAttr = uid('rating');
  private value = 0;
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['value', 'max', 'name', 'size', 'read-only', 'disabled', 'label'];
  }

  private optNum(name: string): number | undefined {
    const v = this.getAttribute(name);
    if (v === null) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }

  protected build(): BuildResult {
    if (!this.initialized) {
      this.value = this.optNum('value') ?? 0;
      this.initialized = true;
    }
    const max = this.optNum('max') ?? 5;
    const size = this.attr('size', 'md');
    const readOnly = this.boolAttr('read-only');
    const disabled = this.boolAttr('disabled');
    const name = this.attr('name') ?? this.nameAttr;
    const fmt = (n: number) => `${n} / ${max}`;
    const cls = ['lily-rating', size !== 'md' && `lily-rating--${size}`];
    const nums = Array.from({ length: max }, (_, i) => i + 1);

    if (readOnly) {
      const root = h('span', { class: cls, attrs: { role: 'img', 'aria-label': fmt(this.value) } });
      for (const n of nums) {
        root.appendChild(
          h('span', { class: ['lily-rating__star', n <= this.value && 'lily-rating__star--on'], attrs: { 'aria-hidden': 'true' }, text: STAR }),
        );
      }
      return { root, slot: null };
    }

    const root = h('div', { class: cls, attrs: { role: 'radiogroup', 'aria-label': this.attr('label', 'Rating')! } });
    const stars: HTMLElement[] = [];
    const refresh = () => {
      stars.forEach((s, idx) => s.classList.toggle('lily-rating__star--on', idx + 1 <= this.value));
    };

    for (const n of nums) {
      const label = h('label', { class: 'lily-rating__label' });
      const input = h('input', {
        class: 'lily-visually-hidden',
        attrs: {
          type: 'radio',
          name,
          value: n,
          checked: this.value === n ? '' : null,
          disabled: disabled ? '' : null,
          'aria-label': fmt(n),
        },
      });
      input.addEventListener('change', () => {
        this.value = n;
        refresh();
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: n }));
      });
      const star = h('span', {
        class: ['lily-rating__star', n <= this.value && 'lily-rating__star--on'],
        attrs: { 'aria-hidden': 'true' },
        text: STAR,
      });
      stars.push(star);
      label.append(input, star);
      root.appendChild(label);
    }

    return { root, slot: null };
  }
}
