import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-date-range-picker>` — pick a start and end date with two coordinated
 * `<lily-date-picker>` elements. The start field caps the end's minimum and
 * vice-versa. Dispatches a `change` event whose `detail` is the
 * `[startIso, endIso]` tuple (each side `null` when empty).
 *
 * Attributes: `start`, `end`, `min`, `max`, `locale`, `week-starts-on`,
 * `disabled`, `start-label`, `end-label`, `separator`, `id`.
 */
export class LilyDateRangePicker extends LilyElement {
  private start: string | null = null;
  private end: string | null = null;
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['start', 'end', 'min', 'max', 'locale', 'week-starts-on', 'disabled', 'start-label', 'end-label', 'separator', 'id'];
  }

  protected build(): BuildResult {
    if (!this.initialized) {
      this.start = this.attr('start') ?? null;
      this.end = this.attr('end') ?? null;
      this.initialized = true;
    }
    const min = this.attr('min');
    const max = this.attr('max');
    const locale = this.attr('locale');
    const weekStartsOn = this.attr('week-starts-on');
    const disabled = this.boolAttr('disabled');

    const root = h('div', { class: 'lily-date-range-picker', attrs: { id: this.attr('id') ?? null } });

    const mk = (value: string | null, label: string): HTMLElement => {
      const dp = document.createElement('lily-date-picker');
      if (value) dp.setAttribute('value', value);
      if (locale) dp.setAttribute('locale', locale);
      if (weekStartsOn) dp.setAttribute('week-starts-on', weekStartsOn);
      if (disabled) dp.setAttribute('disabled', '');
      dp.setAttribute('toggle-label', label);
      dp.setAttribute('placeholder', label);
      return dp;
    };
    const setBound = (el: HTMLElement, name: string, v: string | null | undefined) => {
      if (v) el.setAttribute(name, v);
      else el.removeAttribute(name);
    };

    const startEl = mk(this.start, this.attr('start-label', 'Start date')!);
    const endEl = mk(this.end, this.attr('end-label', 'End date')!);
    setBound(startEl, 'min', min);
    setBound(startEl, 'max', this.end ?? max);
    setBound(endEl, 'min', this.start ?? min);
    setBound(endEl, 'max', max);

    const emit = () => this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [this.start, this.end] }));

    startEl.addEventListener('change', (e) => {
      e.stopPropagation();
      this.start = ((e as CustomEvent).detail as string | null) ?? null;
      setBound(endEl, 'min', this.start ?? min);
      emit();
    });
    endEl.addEventListener('change', (e) => {
      e.stopPropagation();
      this.end = ((e as CustomEvent).detail as string | null) ?? null;
      setBound(startEl, 'max', this.end ?? max);
      emit();
    });

    root.append(startEl, h('span', { class: 'lily-date-range-picker__sep', attrs: { 'aria-hidden': 'true' }, text: this.attr('separator', '–')! }), endEl);
    return { root, slot: null };
  }
}
