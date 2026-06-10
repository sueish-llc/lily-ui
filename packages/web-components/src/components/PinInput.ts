import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-pin-input>` — a row of single-character fields for codes / OTP, with
 * auto-advance, backspace-to-previous, arrow navigation, and paste. Dispatches
 * `change` (every edit) and `complete` (when all cells fill) events whose
 * `detail` is the concatenated value.
 *
 * Attributes: `value`, `length`, `type`, `mask`, `size`, `disabled`, `label`.
 */
export class LilyPinInput extends LilyElement {
  private value = '';
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['value', 'length', 'type', 'mask', 'size', 'disabled', 'label'];
  }

  protected build(): BuildResult {
    if (!this.initialized) {
      this.value = this.attr('value') ?? '';
      this.initialized = true;
    }
    const length = Number(this.attr('length', '6')) || 6;
    const type = this.attr('type', 'numeric');
    const mask = this.boolAttr('mask');
    const size = this.attr('size', 'md');
    const disabled = this.boolAttr('disabled');
    const label = this.attr('label', 'Digit')!;

    const inputs: HTMLInputElement[] = [];
    const isAllowed = (ch: string) => (type === 'numeric' ? /^[0-9]$/.test(ch) : ch.length === 1);
    const focusCell = (i: number) => {
      const el = inputs[Math.max(0, Math.min(length - 1, i))];
      el?.focus();
      el?.select();
    };
    const setCharAt = (i: number, ch: string): string => {
      const arr = Array.from({ length }, (_, k) => this.value[k] ?? ' ');
      arr[i] = ch || ' ';
      return arr.join('').replace(/ +$/, '');
    };
    const commit = (next: string) => {
      this.value = next;
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: next }));
      if (next.length === length && !next.includes(' ')) {
        this.dispatchEvent(new CustomEvent('complete', { bubbles: true, detail: next }));
      }
    };

    const root = h('div', { class: ['lily-pin-input', size !== 'md' && `lily-pin-input--${size}`] });

    for (let i = 0; i < length; i++) {
      const input = h('input', {
        class: 'lily-pin-input__field',
        attrs: {
          type: mask ? 'password' : 'text',
          inputmode: type === 'numeric' ? 'numeric' : 'text',
          autocomplete: i === 0 ? 'one-time-code' : 'off',
          maxlength: 1,
          disabled: disabled ? '' : null,
          value: this.value[i] ?? '',
          'aria-label': `${label} ${i + 1}`,
        },
      });
      input.addEventListener('input', () => {
        const ch = input.value.slice(-1);
        if (ch && !isAllowed(ch)) {
          input.value = this.value[i] ?? '';
          return;
        }
        commit(setCharAt(i, ch));
        if (ch && i < length - 1) focusCell(i + 1);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !(this.value[i] ?? '') && i > 0) {
          e.preventDefault();
          commit(setCharAt(i - 1, ''));
          inputs[i - 1]!.value = this.value[i - 1] ?? '';
          focusCell(i - 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          focusCell(i - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          focusCell(i + 1);
        }
      });
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData?.getData('text') ?? '').split('').filter(isAllowed);
        if (pasted.length === 0) return;
        const arr = Array.from({ length }, (_, k) => this.value[k] ?? ' ');
        for (let k = 0; k < pasted.length && i + k < length; k++) arr[i + k] = pasted[k]!;
        const next = arr.join('').replace(/ +$/, '');
        commit(next);
        for (let k = 0; k < length; k++) inputs[k]!.value = next[k] ?? '';
        focusCell(Math.min(length - 1, i + pasted.length));
      });
      input.addEventListener('focus', () => input.select());
      inputs.push(input);
      root.appendChild(input);
    }

    return { root, slot: null };
  }
}
