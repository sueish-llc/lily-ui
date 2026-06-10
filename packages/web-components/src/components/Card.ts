import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-card>` — a flexible content container. Compose with the part elements
 * `<lily-card-header>`, `<lily-card-body>`, `<lily-card-footer>`, and
 * `<lily-card-title>`.
 *
 * Attributes: `elevated`.
 *
 * @example
 * ```html
 * <lily-card>
 *   <lily-card-header>Header</lily-card-header>
 *   <lily-card-body><lily-card-title>Title</lily-card-title>Body</lily-card-body>
 *   <lily-card-footer>Footer</lily-card-footer>
 * </lily-card>
 * ```
 */
export class LilyCard extends LilyElement {
  static get observedAttributes(): string[] {
    return ['elevated'];
  }

  protected build(): BuildResult {
    const root = h('div', {
      class: ['lily-card', this.boolAttr('elevated') && 'lily-card--elevated'],
    });
    return { root };
  }
}

/** Shared base for Card part elements (`<tag class="lily-card__<part>">`). */
abstract class CardPart extends LilyElement {
  protected abstract partName: string;
  protected abstract defaultTag: keyof HTMLElementTagNameMap;

  static get observedAttributes(): string[] {
    return ['as'];
  }

  protected build(): BuildResult {
    const root = h(this.attr('as', this.defaultTag) as 'div', { class: `lily-card__${this.partName}` });
    return { root };
  }
}

/** `<lily-card-header>` — card header region. */
export class LilyCardHeader extends CardPart {
  protected partName = 'header';
  protected defaultTag: keyof HTMLElementTagNameMap = 'div';
}
/** `<lily-card-body>` — card body region. */
export class LilyCardBody extends CardPart {
  protected partName = 'body';
  protected defaultTag: keyof HTMLElementTagNameMap = 'div';
}
/** `<lily-card-footer>` — card footer region. */
export class LilyCardFooter extends CardPart {
  protected partName = 'footer';
  protected defaultTag: keyof HTMLElementTagNameMap = 'div';
}
/** `<lily-card-title>` — card title heading. */
export class LilyCardTitle extends CardPart {
  protected partName = 'title';
  protected defaultTag: keyof HTMLElementTagNameMap = 'h3';
}
