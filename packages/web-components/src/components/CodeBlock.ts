import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-code-block';
const BTN_CLASS = 'lily-copy-button';

/** Build the copy icon SVG using DOM methods (no innerHTML). */
function makeCopyIcon(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg') as unknown as SVGSVGElement;
  svg.setAttribute('class', `${BTN_CLASS}__icon`);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', '9'); rect.setAttribute('y', '9');
  rect.setAttribute('width', '11'); rect.setAttribute('height', '11');
  rect.setAttribute('rx', '2'); rect.setAttribute('stroke', 'currentColor');
  rect.setAttribute('stroke-width', '1.8');
  svg.appendChild(rect);
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M5 15V5a2 2 0 0 1 2-2h8');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.8');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);
  return svg;
}

/** Build the check icon SVG using DOM methods (no innerHTML). */
function makeCheckIcon(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg') as unknown as SVGSVGElement;
  svg.setAttribute('class', `${BTN_CLASS}__icon`);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M5 12.5l4.5 4.5L19 7');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

/**
 * `<lily-code-block>` — a multi-line, block-level code display with optional
 * language label and one-click copy. Authored children (text) are the code
 * content; alternatively set the `code` attribute.
 *
 * Attributes: `code`, `language`, `show-line-numbers` (boolean),
 * `copyable` (boolean, default true), `copy-label`, `copied-label`.
 *
 * @example
 * ```html
 * <lily-code-block language="tsx" show-line-numbers>
 *   const x = 1;
 * </lily-code-block>
 * ```
 */
export class LilyCodeBlock extends LilyElement {
  private copyTimer: ReturnType<typeof setTimeout> | undefined;

  static get observedAttributes(): string[] {
    return ['code', 'language', 'show-line-numbers', 'copyable', 'copy-label', 'copied-label'];
  }

  disconnectedCallback(): void {
    clearTimeout(this.copyTimer);
  }

  protected build(): BuildResult {
    const language = this.attr('language');
    const showLineNumbers = this.boolAttr('show-line-numbers');
    const copyable = this.getAttribute('copyable') !== 'false';
    const copyLabel = this.attr('copy-label', 'Copy')!;
    const copiedLabel = this.attr('copied-label', 'Copied')!;

    const root = h('div', { class: CLASS });

    const hasHeader = !!(language || copyable);
    if (hasHeader) {
      const header = h('div', { class: `${CLASS}__header` });
      if (language) {
        header.appendChild(h('span', { class: `${CLASS}__language`, attrs: { 'aria-hidden': 'true' }, text: language }));
      }
      if (copyable) {
        const btn = h('button', {
          class: [BTN_CLASS, `${BTN_CLASS}--sm`, `${CLASS}__copy`],
          attrs: { type: 'button', 'aria-label': copyLabel },
        });
        let iconNode: SVGSVGElement = makeCopyIcon();
        btn.appendChild(iconNode);

        const statusSpan = h('span', {
          class: 'lily-visually-hidden',
          attrs: { role: 'status', 'aria-live': 'polite' },
        });
        btn.appendChild(statusSpan);

        btn.addEventListener('click', () => {
          const code = this.attr('code') ?? this.textContent ?? '';
          void navigator.clipboard?.writeText(code.trim()).then(
            () => {
              btn.classList.add(`${BTN_CLASS}--copied`);
              const check = makeCheckIcon();
              btn.replaceChild(check, iconNode);
              iconNode = check;
              btn.setAttribute('aria-label', copiedLabel);
              statusSpan.textContent = copiedLabel;
              clearTimeout(this.copyTimer);
              this.copyTimer = setTimeout(() => {
                btn.classList.remove(`${BTN_CLASS}--copied`);
                const copy = makeCopyIcon();
                btn.replaceChild(copy, iconNode);
                iconNode = copy;
                btn.setAttribute('aria-label', copyLabel);
                statusSpan.textContent = '';
              }, 1600);
            },
            () => {},
          );
        });
        header.appendChild(btn);
      }
      root.appendChild(header);
    }

    const pre = h('pre', {
      class: this.cx(`${CLASS}__pre`, showLineNumbers && `${CLASS}__pre--numbered`),
      attrs: { tabindex: '0' },
    });
    const code = h('code', { class: `${CLASS}__code` });

    if (showLineNumbers) {
      const content = this.attr('code') ?? '';
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const lineEl = h('span', { class: `${CLASS}__line` });
        lineEl.appendChild(h('span', { class: `${CLASS}__line-number`, attrs: { 'aria-hidden': 'true' }, text: String(i + 1) }));
        lineEl.appendChild(h('span', { class: `${CLASS}__line-content`, text: lines[i] }));
        code.appendChild(lineEl);
      }
    } else {
      // Authored children (text content) are slotted into the code element.
    }

    pre.appendChild(code);
    root.appendChild(pre);

    // Slot authored text children into the code element (non-line-numbers mode).
    const slotTarget = showLineNumbers ? null : code;
    return { root, slot: slotTarget };
  }
}
