import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-watermark';

/**
 * `<lily-watermark>` — tiles a low-opacity text (or image) overlay across its
 * children. The overlay is `pointer-events: none` and `aria-hidden`; children
 * render normally beneath it.
 *
 * Attributes: `text`, `image` (URL), `rotate` (deg, default `-22`),
 * `gap-x` (px, default `100`), `gap-y` (px, default `60`),
 * `opacity` (0–1, default `0.12`).
 *
 * @example
 * ```html
 * <lily-watermark text="Confidential">
 *   <p>Protected content</p>
 * </lily-watermark>
 * ```
 */
export class LilyWatermark extends LilyElement {
  static get observedAttributes(): string[] {
    return ['text', 'image', 'rotate', 'gap-x', 'gap-y', 'opacity'];
  }

  protected build(): BuildResult {
    const text = this.attr('text', '');
    const image = this.attr('image');
    const rotate = this.numAttr('rotate', -22);
    const gapX = this.numAttr('gap-x', 100);
    const gapY = this.numAttr('gap-y', 60);
    const opacity = this.numAttr('opacity', 0.12);

    const TILE_W = 200;
    const TILE_H = 120;

    // Build the SVG tile content using DOM (no innerHTML).
    // The resulting SVG is serialised into a data: URI for the CSS
    // background-image — the only place SVG content appears.
    let innerSvg: string;
    if (image) {
      // image is a URL attribute; we do NOT inject it as raw HTML — it goes
      // into a background-image data URI via encodeURIComponent.
      const safeHref = encodeURIComponent(image);
      innerSvg = `<image href="${safeHref}" x="0" y="0" width="${TILE_W}" height="${TILE_H}" preserveAspectRatio="xMidYMid meet"/>`;
    } else {
      // text attribute — escape XML special chars before embedding in SVG.
      const safeText = (text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      innerSvg =
        `<text x="${TILE_W / 2}" y="${TILE_H / 2}" font-size="14" font-family="sans-serif" ` +
        `fill="currentColor" text-anchor="middle" dominant-baseline="middle" ` +
        `transform="rotate(${rotate}, ${TILE_W / 2}, ${TILE_H / 2})">${safeText}</text>`;
    }
    const svgSource =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}">${innerSvg}</svg>`;
    const dataUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svgSource)}")`;

    const root = h('div', { class: CLASS });

    const overlay = h('div', { class: `${CLASS}__overlay`, attrs: { 'aria-hidden': 'true' } });
    overlay.style.backgroundImage = dataUrl;
    overlay.style.backgroundRepeat = 'repeat';
    overlay.style.backgroundSize = `${TILE_W + gapX}px ${TILE_H + gapY}px`;
    overlay.style.opacity = String(opacity);

    root.appendChild(overlay);

    // Children are slotted into the root; CSS ensures they sit above the overlay.
    return { root, slot: root };
  }
}
