import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-kbd>` — an inline keyboard key/shortcut.
 *
 * @example
 * ```html
 * <lily-kbd>⌘</lily-kbd> <lily-kbd>K</lily-kbd>
 * ```
 */
export class LilyKbd extends LilyElement {
  protected build(): BuildResult {
    return { root: h('kbd', { class: 'lily-kbd' }) };
  }
}

/**
 * `<lily-code>` — inline (or block) monospace code.
 *
 * Attributes: `block`.
 */
export class LilyCode extends LilyElement {
  static get observedAttributes(): string[] {
    return ['block'];
  }

  protected build(): BuildResult {
    return {
      root: h('code', { class: ['lily-code', this.boolAttr('block') && 'lily-code--block'] }),
    };
  }
}
