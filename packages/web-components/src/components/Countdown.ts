import { LilyElement, h, type BuildResult } from '../base/LilyElement';
import { remainingDuration, type InstantInput } from '../utils/datetime';

export type CountdownFormat = 'dhms' | 'hms';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * `<lily-countdown>` — displays the remaining time to a target as d/h/m/s
 * segments. Ticks each second when `live` (the default). Uses the Temporal API;
 * the `to` attribute is an ISO string that is parsed to Temporal internally.
 * Dispatches a `complete` event when it reaches zero.
 *
 * Attributes:
 * - `to` — ISO datetime or instant string (required).
 * - `format` — `'dhms'` (default) | `'hms'`.
 * - `live` — boolean; tick every second (default present = true).
 */
export class LilyCountdown extends LilyElement {
  private _timer: ReturnType<typeof setInterval> | null = null;
  private _completed = false;

  static get observedAttributes(): string[] {
    return ['to', 'format', 'live'];
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
    if (name === 'to' || name === 'live') {
      this._completed = false;
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
    // Default: live unless the attribute is explicitly absent but we treat the
    // presence of `live` attribute as true; absence means check the default.
    // Per spec: live is true by default for Countdown. We use !hasAttribute('live')
    // only when the attribute value is 'false'.
    const liveAttr = this.getAttribute('live');
    const isLive = liveAttr !== 'false'; // live by default
    if (!isLive) return;

    this._timer = setInterval(() => {
      this.rerender();
      const { days, hours, minutes, seconds } = this._segments();
      const done = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
      if (done && !this._completed) {
        this._completed = true;
        this._stopTimer();
        this.dispatchEvent(new CustomEvent('complete', { bubbles: true }));
      }
    }, 1000);
  }

  private _segments(): { days: number; hours: number; minutes: number; seconds: number } {
    const toRaw = this.attr('to', '');
    const format = (this.attr('format', 'dhms') as CountdownFormat);

    if (!toRaw) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    try {
      const dur = remainingDuration(toRaw as InstantInput);
      const d = dur.days;
      const h = dur.hours;
      const m = dur.minutes;
      const s = dur.seconds;
      if (format === 'hms') return { days: 0, hours: d * 24 + h, minutes: m, seconds: s };
      return { days: d, hours: h, minutes: m, seconds: s };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  protected build(): BuildResult {
    const format = (this.attr('format', 'dhms') as CountdownFormat);
    const { days, hours, minutes, seconds } = this._segments();
    const showDays = format === 'dhms';

    const root = h('div', {
      class: 'lily-countdown',
      attrs: { role: 'timer', 'aria-live': 'off' },
    });

    const seg = (val: number, label: string) => {
      const s = h('span', { class: 'lily-countdown__segment' });
      s.appendChild(h('span', { class: 'lily-countdown__value', text: pad2(val) }));
      s.appendChild(h('span', { class: 'lily-countdown__label', text: label }));
      return s;
    };

    if (showDays) root.appendChild(seg(days, 'd'));
    root.appendChild(seg(hours, 'h'));
    root.appendChild(seg(minutes, 'm'));
    root.appendChild(seg(seconds, 's'));

    return { root, slot: null };
  }
}
