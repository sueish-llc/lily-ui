import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-tag-input>` — collect multiple tokens. Type and press Enter (or a
 * delimiter) to add; Backspace on an empty field removes the last tag. Tags are
 * seeded from a JSON `value` attribute. Dispatches a `change` event whose
 * `detail` is the string array.
 *
 * Attributes: `value`, `placeholder`, `delimiters` (comma-joined), `unique`,
 * `disabled`, `label`, `remove-label`.
 */
export class LilyTagInput extends LilyElement {
  private tags: string[] = [];
  private draft = '';
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'delimiters', 'unique', 'disabled', 'label', 'remove-label'];
  }

  private emit(): void {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [...this.tags] }));
  }

  private addTag(raw: string): void {
    const t = raw.trim();
    const unique = this.attr('unique') !== 'false';
    if (!t) return;
    if (unique && this.tags.includes(t)) {
      this.draft = '';
      this.rerender();
      this.focusField();
      return;
    }
    this.tags = [...this.tags, t];
    this.draft = '';
    this.emit();
    this.rerender();
    this.focusField();
  }

  private removeAt(i: number): void {
    this.tags = this.tags.filter((_, idx) => idx !== i);
    this.emit();
    this.rerender();
    this.focusField();
  }

  private focusField(): void {
    (this.querySelector('.lily-tag-input__field') as HTMLInputElement | null)?.focus();
  }

  protected build(): BuildResult {
    if (!this.initialized) {
      const raw = this.attr('value');
      if (raw) {
        try {
          const p = JSON.parse(raw);
          if (Array.isArray(p)) this.tags = p as string[];
        } catch {
          /* ignore malformed JSON */
        }
      }
      this.initialized = true;
    }
    const disabled = this.boolAttr('disabled');
    const delimiters = (this.attr('delimiters') ?? ',').split('');
    const removeLabel = (t: string) => `${this.attr('remove-label', 'Remove')!} ${t}`;

    const root = h('div', {
      class: ['lily-tag-input', disabled && 'lily-tag-input--disabled'],
      attrs: { role: 'group', 'aria-label': this.attr('label') ?? null },
    });

    this.tags.forEach((tag, i) => {
      const chip = h('span', { class: 'lily-chip' });
      chip.appendChild(h('span', { text: tag }));
      if (!disabled) {
        const rm = h('button', {
          class: 'lily-chip__remove',
          attrs: { type: 'button', 'aria-label': removeLabel(tag) },
        });
        rm.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '×' }));
        rm.addEventListener('click', () => this.removeAt(i));
        chip.appendChild(rm);
      }
      root.appendChild(chip);
    });

    const input = h('input', {
      class: 'lily-tag-input__field',
      attrs: {
        id: this.attr('id') ?? null,
        value: this.draft,
        placeholder: this.attr('placeholder') ?? null,
        disabled: disabled ? '' : null,
      },
    });
    input.addEventListener('input', () => {
      this.draft = input.value;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || delimiters.includes(e.key)) {
        e.preventDefault();
        this.addTag(this.draft);
      } else if (e.key === 'Backspace' && this.draft === '' && this.tags.length > 0) {
        this.removeAt(this.tags.length - 1);
      }
    });
    input.addEventListener('blur', () => this.addTag(this.draft));
    root.addEventListener('click', () => input.focus());
    root.appendChild(input);

    return { root, slot: null };
  }
}
