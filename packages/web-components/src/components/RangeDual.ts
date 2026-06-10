import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-range-dual>` — a two-thumb range slider for selecting a span. Each
 * thumb is a native range input; the thumbs cannot cross. Dispatches a `change`
 * event whose `detail` is the `[low, high]` tuple.
 *
 * Attributes: `min`, `max`, `step`, `value` (comma-joined `low,high`),
 * `disabled`, `min-label`, `max-label`, `id`.
 */
export class LilyRangeDual extends LilyElement {
  private lo: number | null = null;
  private hi: number | null = null;

  static get observedAttributes(): string[] {
    return ['min', 'max', 'step', 'value', 'disabled', 'min-label', 'max-label', 'id'];
  }

  protected build(): BuildResult {
    const min = this.numAttr('min', 0);
    const max = this.numAttr('max', 100);
    const step = this.numAttr('step', 1);
    const disabled = this.boolAttr('disabled');

    if (this.lo === null || this.hi === null) {
      const raw = (this.attr('value') ?? '').split(',').map((s) => Number(s.trim()));
      this.lo = Number.isFinite(raw[0]!) ? raw[0]! : min;
      this.hi = Number.isFinite(raw[1]!) ? raw[1]! : max;
    }

    const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
    const root = h('div', { class: 'lily-range-dual' });
    const fill = h('span', { class: 'lily-range-dual__fill', attrs: { 'aria-hidden': 'true' } });
    const setVars = () => {
      root.style.setProperty('--lily-range-min', pct(this.lo!));
      root.style.setProperty('--lily-range-max', pct(this.hi!));
    };

    const low = h('input', {
      class: 'lily-range-dual__input',
      attrs: { type: 'range', id: this.attr('id') ?? null, min, max, step, value: this.lo, disabled: disabled ? '' : null, 'aria-label': this.attr('min-label', 'Minimum')! },
    }) as HTMLInputElement;
    const high = h('input', {
      class: 'lily-range-dual__input',
      attrs: { type: 'range', min, max, step, value: this.hi, disabled: disabled ? '' : null, 'aria-label': this.attr('max-label', 'Maximum')! },
    }) as HTMLInputElement;

    const emit = () => this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [this.lo, this.hi] }));
    low.addEventListener('input', () => {
      this.lo = Math.min(Number(low.value), this.hi!);
      low.value = String(this.lo);
      setVars();
      emit();
    });
    high.addEventListener('input', () => {
      this.hi = Math.max(Number(high.value), this.lo!);
      high.value = String(this.hi);
      setVars();
      emit();
    });

    root.append(h('span', { class: 'lily-range-dual__track', attrs: { 'aria-hidden': 'true' } }), fill, low, high);
    setVars();
    return { root, slot: null };
  }
}
