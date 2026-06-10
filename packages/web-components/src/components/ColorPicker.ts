import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/** A friendly default palette drawn from the 彩 worldview + neutrals. */
export const DEFAULT_SWATCHES = ['#cd2e69', '#f05537', '#ee4d7a', '#e89c0c', '#2f7a43', '#41549f', '#534d45', '#14110e'];

/**
 * `<lily-color-picker>` — a palette of preset swatches plus an optional native
 * custom color input. Dispatches a `change` event whose `detail` is the hex
 * color.
 *
 * Attributes: `value`, `swatches` (comma-joined hex), `custom` (`false` to
 * hide), `custom-label`, `label`.
 */
export class LilyColorPicker extends LilyElement {
  private value: string | null = null;
  private initialized = false;
  private inputId = uid('color');

  static get observedAttributes(): string[] {
    return ['value', 'swatches', 'custom', 'custom-label', 'label'];
  }

  protected build(): BuildResult {
    const swatches = (this.attr('swatches') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const palette = swatches.length > 0 ? swatches : DEFAULT_SWATCHES;
    if (!this.initialized) {
      this.value = this.attr('value') ?? palette[0]!;
      this.initialized = true;
    }
    const showCustom = this.attr('custom') !== 'false';

    const root = h('div', { class: 'lily-color-picker' });
    const group = h('div', { class: 'lily-color-picker__swatches', attrs: { role: 'group', 'aria-label': this.attr('label', 'Color')! } });
    for (const hex of palette) {
      const sw = h('button', {
        class: 'lily-color-picker__swatch',
        attrs: { type: 'button', 'aria-label': hex, 'aria-pressed': String(this.value?.toLowerCase() === hex.toLowerCase()) },
      });
      sw.style.backgroundColor = hex;
      sw.addEventListener('click', () => {
        this.value = hex;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: hex }));
        this.rerender();
      });
      group.appendChild(sw);
    }
    root.appendChild(group);

    if (showCustom) {
      const custom = h('span', { class: 'lily-color-picker__custom' });
      custom.appendChild(h('label', { attrs: { for: this.inputId }, text: this.attr('custom-label', 'Custom')! }));
      const input = h('input', {
        class: 'lily-color-picker__input',
        attrs: { id: this.inputId, type: 'color', value: this.value ?? '#000000' },
      }) as HTMLInputElement;
      input.addEventListener('input', () => {
        this.value = input.value;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: input.value }));
      });
      custom.appendChild(input);
      root.appendChild(custom);
    }

    return { root, slot: null };
  }
}
