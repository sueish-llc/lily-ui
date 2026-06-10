import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * `<lily-segmented-control>` — a single-select toggle group built on native
 * radios. Options are a JSON `options` attribute (`{ value, label, disabled? }`).
 * Dispatches a `change` event whose `detail` is the selected value.
 *
 * Attributes: `options`, `name`, `size`, `block`, `label`.
 */
export class LilySegmentedControl extends LilyElement {
  private nameAttr = uid('seg');
  private value: string | null = null;

  static get observedAttributes(): string[] {
    return ['options', 'name', 'size', 'block', 'label'];
  }

  private parse(): SegmentedOption[] {
    const raw = this.attr('options');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as SegmentedOption[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const opts = this.parse();
    const size = this.attr('size', 'md');
    const name = this.attr('name') ?? this.nameAttr;
    if (this.value === null) this.value = opts[0]?.value ?? null;

    const root = h('div', {
      class: ['lily-segmented', size !== 'md' && `lily-segmented--${size}`, this.boolAttr('block') && 'lily-segmented--block'],
      attrs: { role: 'radiogroup', 'aria-label': this.attr('label') ?? null },
    });

    for (const opt of opts) {
      const label = h('label', { class: 'lily-segmented__option' });
      const input = h('input', {
        class: 'lily-visually-hidden',
        attrs: {
          type: 'radio',
          name,
          value: opt.value,
          checked: this.value === opt.value ? '' : null,
          disabled: opt.disabled ? '' : null,
        },
      });
      input.addEventListener('change', () => {
        this.value = opt.value;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: opt.value }));
      });
      label.appendChild(input);
      label.appendChild(h('span', { text: opt.label }));
      root.appendChild(label);
    }

    return { root, slot: null };
  }
}
