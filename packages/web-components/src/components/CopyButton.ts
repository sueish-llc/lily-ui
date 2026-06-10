import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-copy-button';

const COPY_SVG = `<svg class="${CLASS}__icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V5a2 2 0 0 1 2-2h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const CHECK_SVG = `<svg class="${CLASS}__icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/**
 * `<lily-copy-button>` — copies `value` to the clipboard and confirms with a
 * check icon. Icon-only by default; set `label` for a labelled button.
 *
 * Attributes: `value`, `label`, `copy-label`, `copied-label`, `size` (`sm`|`md`).
 *
 * @example
 * ```html
 * <lily-copy-button value="--lily-color-primary-100"></lily-copy-button>
 * ```
 */
export class LilyCopyButton extends LilyElement {
  private timer: ReturnType<typeof setTimeout> | undefined;

  static get observedAttributes(): string[] {
    return ['value', 'label', 'copy-label', 'copied-label', 'size'];
  }

  disconnectedCallback(): void {
    clearTimeout(this.timer);
  }

  protected build(): BuildResult {
    const size = this.attr('size', 'md');
    const label = this.attr('label');
    const copyLabel = this.attr('copy-label', 'Copy')!;
    const copiedLabel = this.attr('copied-label', 'Copied')!;

    const root = h('button', {
      class: [CLASS, `${CLASS}--${size}`],
      attrs: { type: 'button', 'aria-label': label == null ? copyLabel : null },
    });
    const icon = h('span', { html: COPY_SVG });
    icon.style.display = 'contents';
    root.appendChild(icon);

    let labelEl: HTMLElement | null = null;
    if (label != null) {
      labelEl = h('span', { class: `${CLASS}__label`, text: label });
      root.appendChild(labelEl);
    }
    const status = h('span', {
      class: 'lily-visually-hidden',
      attrs: { role: 'status', 'aria-live': 'polite' },
    });
    root.appendChild(status);

    root.addEventListener('click', () => {
      void navigator.clipboard?.writeText(this.attr('value') ?? '').then(
        () => {
          root.classList.add(`${CLASS}--copied`);
          icon.innerHTML = CHECK_SVG;
          if (labelEl) labelEl.textContent = copiedLabel;
          else root.setAttribute('aria-label', copiedLabel);
          status.textContent = copiedLabel;
          this.dispatchEvent(new CustomEvent('copy', { bubbles: true, detail: this.attr('value') }));
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            root.classList.remove(`${CLASS}--copied`);
            icon.innerHTML = COPY_SVG;
            if (labelEl) labelEl.textContent = label!;
            else root.setAttribute('aria-label', copyLabel);
            status.textContent = '';
          }, 1600);
        },
        () => {},
      );
    });

    return { root };
  }
}
