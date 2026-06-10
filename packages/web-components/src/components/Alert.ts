import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type AlertStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';

/**
 * `<lily-alert>` — a contextual feedback message.
 *
 * The default content becomes the alert body. Use the `title` attribute for a
 * bold heading and `icon` for a leading glyph. Set `dismissible` to show a
 * close button, which dispatches a `close` event.
 *
 * Attributes: `status`, `title`, `icon`, `dismissible`, `close-label`, `role`.
 *
 * @example
 * ```html
 * <lily-alert status="success" title="Saved">Your changes are stored.</lily-alert>
 * <lily-alert status="danger" role="alert" dismissible>Something failed.</lily-alert>
 * ```
 */
export class LilyAlert extends LilyElement {
  static get observedAttributes(): string[] {
    return ['status', 'title', 'icon', 'dismissible', 'close-label', 'role'];
  }

  protected build(): BuildResult {
    const root = h('div', {
      class: 'lily-alert',
      attrs: {
        role: this.attr('role', 'status')!,
        'data-status': this.attr('status', 'primary') ?? null,
      },
    });

    const icon = this.attr('icon');
    if (icon) {
      root.appendChild(h('span', { class: 'lily-alert__icon', attrs: { 'aria-hidden': 'true' }, text: icon }));
    }

    const body = h('div', { class: 'lily-alert__body' });
    const title = this.attr('title');
    if (title) {
      body.appendChild(h('div', { class: 'lily-alert__title', text: title }));
    }
    root.appendChild(body);

    if (this.boolAttr('dismissible')) {
      const close = h('button', {
        class: 'lily-close',
        attrs: { type: 'button', 'aria-label': this.attr('close-label', 'Close')! },
      });
      close.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&times;' }));
      close.addEventListener('click', () =>
        this.dispatchEvent(new CustomEvent('close', { bubbles: true })),
      );
      root.appendChild(close);
    }

    return { root, slot: body };
  }
}
