import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** Avatar size, mapped to the control-height tokens. */
export type AvatarSize = 'sm' | 'md' | 'lg';
/** Presence/status conveyed by the corner dot. */
export type AvatarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Derive up to two uppercase initials from a display name. */
function initialsOf(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}

/**
 * `<lily-avatar>` — a user/entity thumbnail with image, initials fallback, and
 * an optional presence dot.
 *
 * Attributes: `src`, `name`, `alt`, `size`, `square`, `status`, `status-label`.
 *
 * @example
 * ```html
 * <lily-avatar name="Ada Lovelace" status="success" status-label="online"></lily-avatar>
 * ```
 */
export class LilyAvatar extends LilyElement {
  static get observedAttributes(): string[] {
    return ['src', 'name', 'alt', 'size', 'square', 'status', 'status-label'];
  }

  protected build(): BuildResult {
    const size = this.attr('size', 'md');
    const src = this.attr('src');
    const name = this.attr('name') ?? this.attr('alt');
    const status = this.attr('status');
    const labelParts = [name, status ? (this.attr('status-label') ?? status) : null].filter(Boolean) as string[];
    const label = labelParts.length > 0 ? labelParts.join(', ') : null;

    const root = h('span', {
      class: ['lily-avatar', size !== 'md' && `lily-avatar--${size}`, this.boolAttr('square') && 'lily-avatar--square'],
      attrs: { role: label ? 'img' : null, 'aria-label': label },
    });

    let slot: HTMLElement;
    if (src) {
      root.appendChild(h('img', { class: 'lily-avatar__img', attrs: { src, alt: '', 'aria-hidden': 'true' } }));
      slot = h('span'); // detached sink: authored children are not shown for image avatars
    } else {
      const inner = h('span', { attrs: { 'aria-hidden': 'true' }, text: initialsOf(name) });
      root.appendChild(inner);
      slot = inner;
    }

    if (status) {
      root.appendChild(
        h('span', { class: 'lily-avatar__status', attrs: { 'data-status': status, 'aria-hidden': 'true' } }),
      );
    }

    return { root, slot };
  }
}

/**
 * `<lily-avatar-group>` — overlap a row of `<lily-avatar>`s. Append a final
 * `<lily-avatar name="+3">+3</lily-avatar>` to show an overflow count.
 */
export class LilyAvatarGroup extends LilyElement {
  protected build(): BuildResult {
    return { root: h('div', { class: 'lily-avatar-group' }) };
  }
}
