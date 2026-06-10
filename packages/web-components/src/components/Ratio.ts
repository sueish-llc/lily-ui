import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** A named ratio shorthand. */
export type NamedRatio = '1x1' | '4x3' | '16x9' | '21x9';

const NAMED: Record<NamedRatio, [number, number]> = {
  '1x1': [1, 1],
  '4x3': [4, 3],
  '16x9': [16, 9],
  '21x9': [21, 9],
};

/**
 * `<lily-ratio>` — maintains an aspect ratio for embedded content.
 *
 * Set `ratio` to a named shorthand (`1x1`, `4x3`, `16x9`, `21x9`) or an
 * explicit `width:height` pair such as `3:2`. The CSS variable
 * `--lily-aspect-ratio` is set on the wrapper `<div>`.
 *
 * Attributes: `ratio`.
 *
 * @example
 * ```html
 * <lily-ratio ratio="16x9"><iframe title="demo" src="…"></iframe></lily-ratio>
 * <lily-ratio ratio="3:2"><img src="…" alt="" /></lily-ratio>
 * ```
 */
export class LilyRatio extends LilyElement {
  static get observedAttributes(): string[] {
    return ['ratio'];
  }

  protected build(): BuildResult {
    const ratioAttr = this.attr('ratio', '16x9')!;
    let w: number;
    let h_: number;

    if (ratioAttr in NAMED) {
      [w, h_] = NAMED[ratioAttr as NamedRatio];
    } else {
      // Accept "w:h" or "wxh" formats
      const sep = ratioAttr.includes(':') ? ':' : 'x';
      const parts = ratioAttr.split(sep).map(Number);
      w = parts[0] ?? 16;
      h_ = parts[1] ?? 9;
    }

    const percentage = `${(h_ / w) * 100}%`;

    const root = h('div', { class: 'lily-ratio' });
    root.style.setProperty('--lily-aspect-ratio', percentage);

    return { root };
  }
}
