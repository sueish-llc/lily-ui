import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-number-input>` — a numeric field with stepper buttons. The native
 * input keeps spinbutton semantics; the buttons add a pointer affordance.
 * Dispatches a `change` event whose `detail` is the value (`null` when empty).
 *
 * Attributes: `value`, `min`, `max`, `step`, `size`, `disabled`, `id`, `label`,
 * `decrement-label`, `increment-label`.
 */
export class LilyNumberInput extends LilyElement {
  private value: number | null = null;
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['value', 'min', 'max', 'step', 'size', 'disabled', 'id', 'label', 'decrement-label', 'increment-label'];
  }

  private optNum(name: string): number | undefined {
    const v = this.getAttribute(name);
    if (v === null) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }

  private clamp(n: number): number {
    const min = this.optNum('min');
    const max = this.optNum('max');
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  }

  protected build(): BuildResult {
    if (!this.initialized) {
      this.value = this.optNum('value') ?? null;
      this.initialized = true;
    }
    const size = this.attr('size', 'md');
    const step = this.optNum('step') ?? 1;
    const min = this.optNum('min');
    const max = this.optNum('max');
    const disabled = this.boolAttr('disabled');

    const root = h('div', {
      class: ['lily-number-input', size !== 'md' && `lily-number-input--${size}`],
    });

    const dec = h('button', {
      class: 'lily-number-input__btn',
      attrs: { type: 'button', 'aria-label': this.attr('decrement-label', 'Decrease')! },
    });
    dec.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '−' }));

    const input = h('input', {
      class: 'lily-number-input__field',
      attrs: {
        type: 'number',
        inputmode: 'decimal',
        id: this.attr('id') ?? null,
        'aria-label': this.attr('label') ?? null,
        value: this.value ?? '',
        min,
        max,
        step,
        disabled: disabled ? '' : null,
      },
    });

    const inc = h('button', {
      class: 'lily-number-input__btn',
      attrs: { type: 'button', 'aria-label': this.attr('increment-label', 'Increase')! },
    });
    inc.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '+' }));

    const atMin = () => min != null && this.value != null && this.value <= min;
    const atMax = () => max != null && this.value != null && this.value >= max;
    const updateDisabled = () => {
      dec.toggleAttribute('disabled', disabled || atMin());
      inc.toggleAttribute('disabled', disabled || atMax());
    };
    const setVal = (n: number | null) => {
      this.value = n;
      input.value = n == null ? '' : String(n);
      updateDisabled();
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: n }));
    };

    dec.addEventListener('click', () => setVal(this.clamp((this.value ?? min ?? 0) - step)));
    inc.addEventListener('click', () => setVal(this.clamp((this.value ?? min ?? 0) + step)));
    input.addEventListener('input', () => {
      const raw = input.value;
      this.value = raw === '' ? null : this.clamp(Number(raw));
      updateDisabled();
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: this.value }));
    });

    updateDisabled();
    root.append(dec, input, inc);
    return { root, slot: null };
  }
}
