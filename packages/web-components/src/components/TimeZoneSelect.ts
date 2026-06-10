import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** Small fallback list used when `Intl.supportedValuesOf` is unavailable. */
const FALLBACK_ZONES = [
  'UTC',
  'Asia/Tokyo',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Australia/Sydney',
];

/** The available IANA time-zone ids, sourced from the runtime when possible. */
function supportedTimeZones(): readonly string[] {
  const supported = (
    Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf;
  if (typeof supported === 'function') {
    try {
      const zones = supported('timeZone');
      if (zones.length > 0) return zones;
    } catch {
      // fall through to the static list
    }
  }
  return FALLBACK_ZONES;
}

/**
 * `<lily-time-zone-select>` — choose an IANA time-zone id (e.g. `'Asia/Tokyo'`)
 * from a native `<select>`. The option list comes from `Intl.supportedValuesOf`,
 * with a small static fallback for runtimes that lack it. The `value` attribute
 * and the `change` event detail are the IANA id string that the `Temporal` API
 * consumes.
 *
 * Attributes: `value` (IANA id), `placeholder`, `disabled`, `aria-label`.
 *
 * @example
 * ```html
 * <lily-time-zone-select value="Asia/Tokyo"></lily-time-zone-select>
 * ```
 */
export class LilyTimeZoneSelect extends LilyElement {
  static get observedAttributes(): string[] {
    return ['value', 'placeholder', 'disabled', 'aria-label'];
  }

  protected build(): BuildResult {
    const disabled = this.boolAttr('disabled');
    const placeholder = this.attr('placeholder');
    const value = this.attr('value') ?? '';
    const ariaLabel = this.attr('aria-label');

    const root = h('span', { class: 'lily-time-zone-select' });

    const select = h('select', {
      class: 'lily-select',
      attrs: { disabled: disabled ? '' : null, 'aria-label': ariaLabel ?? null },
    }) as HTMLSelectElement;

    if (placeholder != null) {
      select.appendChild(h('option', { attrs: { value: '', disabled: '' }, text: placeholder }));
    }
    for (const tz of supportedTimeZones()) {
      select.appendChild(h('option', { attrs: { value: tz }, text: tz }));
    }
    select.value = value;

    select.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: select.value }));
    });

    root.appendChild(select);
    return { root, slot: null };
  }
}
