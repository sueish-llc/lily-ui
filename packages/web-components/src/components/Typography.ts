import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type TextVariant = 'body' | 'lead' | 'small' | 'label' | 'caption' | 'overline';
export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'primary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * `<lily-text>` — body/label/caption typography with semantic tone. Renders a
 * `<p>` by default; change with `as`.
 *
 * Attributes: `as`, `variant`, `tone`, `truncate`.
 */
export class LilyText extends LilyElement {
  static get observedAttributes(): string[] {
    return ['as', 'variant', 'tone', 'truncate'];
  }

  protected build(): BuildResult {
    const variant = this.attr('variant', 'body');
    const tone = this.attr('tone', 'default');
    const root = h(this.attr('as', 'p') as 'p', {
      class: [
        'lily-text',
        variant !== 'body' && `lily-text--${variant}`,
        this.boolAttr('truncate') && 'lily-text--truncate',
      ],
      attrs: { 'data-tone': tone !== 'default' ? tone : null },
    });
    return { root };
  }
}

/**
 * `<lily-heading>` — `h1`–`h6` with a token-driven scale. `level` sets semantics
 * and the default size; `display` opts into the hero scale; `as` decouples the
 * rendered tag from the visual level.
 *
 * Attributes: `as`, `level`, `display`, `gradient`.
 */
export class LilyHeading extends LilyElement {
  static get observedAttributes(): string[] {
    return ['as', 'level', 'display', 'gradient'];
  }

  protected build(): BuildResult {
    const level = this.numAttr('level', 2);
    const display = this.boolAttr('display');
    const root = h(this.attr('as', `h${level}`) as 'h2', {
      class: [
        'lily-heading',
        display ? 'lily-heading--display' : `lily-heading--${level}`,
        this.boolAttr('gradient') && 'lily-heading--gradient',
      ],
    });
    return { root };
  }
}
