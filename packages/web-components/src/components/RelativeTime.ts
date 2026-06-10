import { LilyElement, h, type BuildResult } from '../base/LilyElement';
import { formatRelative, toInstant, type InstantInput } from '../utils/datetime';

/**
 * `<lily-relative-time>` — renders a `<time>` element with human-readable
 * relative text (e.g. "3分前", "in 2 hours"). Uses `Intl.RelativeTimeFormat`
 * and the Temporal API. Parses all value/base attributes as ISO strings into
 * Temporal internally.
 *
 * Attributes:
 * - `value` — ISO instant / date / datetime string (required).
 * - `base` — reference ISO string (default: now).
 * - `locale` — BCP-47 locale.
 * - `numeric` — `'auto'` | `'always'` (default `'auto'`).
 * - `live` — boolean; re-renders every `update-interval` ms.
 * - `update-interval` — ms between live ticks (default `30000`).
 */
export class LilyRelativeTime extends LilyElement {
  private _timer: ReturnType<typeof setInterval> | null = null;

  static get observedAttributes(): string[] {
    return ['value', 'base', 'locale', 'numeric', 'live', 'update-interval'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._startTimer();
  }

  disconnectedCallback(): void {
    this._stopTimer();
  }

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    // Restart the timer if live-related attributes change.
    if (name === 'live' || name === 'update-interval') {
      this._stopTimer();
      this._startTimer();
    }
  }

  private _stopTimer(): void {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  private _startTimer(): void {
    // Always clear any running interval first: with attributes present at parse
    // time, `attributeChangedCallback` fires before `connectedCallback`, and
    // both call `_startTimer()` — without this guard the first interval leaks.
    this._stopTimer();
    // Only tick while in the document: an attribute change on a disconnected
    // element must not start an interval (connectedCallback starts it later).
    if (!this.isConnected) return;
    if (!this.boolAttr('live')) return;
    // Guard against `update-interval <= 0`, which would make setInterval spin
    // as fast as the event loop allows. Sub-second ticks are pointless for
    // relative text anyway (the finest unit is seconds).
    const interval = Math.max(1000, this.numAttr('update-interval', 30_000));
    this._timer = setInterval(() => this.rerender(), interval);
  }

  protected build(): BuildResult {
    const raw = this.attr('value', '');
    const baseRaw = this.attr('base');
    const locale = this.attr('locale');
    const numeric = (this.attr('numeric', 'auto') as 'auto' | 'always');

    let text = '';
    let iso = raw ?? '';

    if (raw) {
      try {
        const inst = toInstant(raw as InstantInput);
        iso = inst.toString();
        const now = baseRaw ? toInstant(baseRaw as InstantInput) : Temporal.Now.instant();
        text = formatRelative(inst, now, locale, numeric);
      } catch {
        text = raw;
      }
    }

    const el = h('time', {
      class: 'lily-relative-time',
      attrs: { datetime: iso },
      text,
    });

    return { root: el, slot: null };
  }
}
