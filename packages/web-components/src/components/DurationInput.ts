import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const pad2 = (n: number) => String(n).padStart(2, '0');
const clampField = (n: number, max: number) => Math.max(0, Math.min(max, Math.floor(n)));

/** Field-wise equality on the h/m/s parts this element edits. */
const sameDuration = (a: Temporal.Duration | null, b: Temporal.Duration | null): boolean =>
  a === null
    ? b === null
    : b !== null && a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds;

type Unit = 'hours' | 'minutes' | 'seconds';

interface FieldRefs {
  unit: Unit;
  max: number;
  input: HTMLInputElement;
  dec: HTMLButtonElement;
  inc: HTMLButtonElement;
}

/**
 * `<lily-duration-input>` — numeric fields (hours, minutes, optional seconds)
 * backed by `Temporal.Duration`. The `value` attribute is an ISO duration
 * string (e.g. `"PT1H30M0S"`); the element parses it to Temporal internally
 * and dispatches a `change` event whose `detail` is an ISO duration string
 * (or `null` when empty).
 *
 * Attributes:
 * - `value` — ISO duration string (e.g. `"PT1H30M0S"`).
 * - `with-seconds` — boolean; show the seconds field.
 * - `disabled` — boolean.
 * - `size` — `'sm'` | `'md'` | `'lg'`.
 * - `status` — semantic status modifier.
 * - `name` — forwarded to a hidden serialization input.
 * - `hours-label`, `minutes-label`, `seconds-label` — field labels.
 */
export class LilyDurationInput extends LilyElement {
  private _dur: Temporal.Duration | null = null;
  private _initialized = false;
  // Live references into the built DOM. Value changes (typing, steppers, a
  // controlled `value` echo) are patched onto these in place — rebuilding would
  // destroy the `<input>` mid-typing and drop focus to `<body>`, making
  // two-digit entry impossible.
  private _fields: FieldRefs[] = [];
  private _hidden: HTMLInputElement | null = null;

  static get observedAttributes(): string[] {
    return ['value', 'with-seconds', 'disabled', 'size', 'status', 'name', 'hours-label', 'minutes-label', 'seconds-label'];
  }

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    // A `value` attribute change only moves the internal duration: patch the
    // fields in place so an input being typed in keeps focus. `setAttribute`
    // fires this even for an unchanged string, which is how a host reverts an
    // ignored `change` (same dirty semantics as TimePicker) — so compare the
    // *parsed* duration against the internal one, not raw attribute strings.
    if (name === 'value' && this._initialized && this._fields.length > 0) {
      const parsed = this._parseDuration(this.getAttribute('value') ?? undefined);
      if (!sameDuration(parsed, this._dur)) {
        this._dur = parsed;
        this._syncFields();
      }
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _parseDuration(raw: string | undefined): Temporal.Duration | null {
    if (!raw) return null;
    try { return Temporal.Duration.from(raw); } catch { return null; }
  }

  private _iso(): string | null {
    return this._dur
      ? `PT${this._dur.hours}H${this._dur.minutes}M${this._dur.seconds}S`
      : null;
  }

  private _part(unit: Unit): number | null {
    if (!this._dur) return null;
    return unit === 'hours' ? this._dur.hours : unit === 'minutes' ? this._dur.minutes : this._dur.seconds;
  }

  private _dispatch(): void {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: this._iso() }));
  }

  /**
   * Sync field displays + stepper disabled states from `_dur` in place. The
   * currently focused input is left untouched so typing isn't clobbered
   * (e.g. "1" reformatted to "01" between two keystrokes).
   */
  private _syncFields(): void {
    const disabled = this.boolAttr('disabled');
    for (const f of this._fields) {
      const val = this._part(f.unit);
      const display = val !== null ? pad2(val) : '';
      if (document.activeElement !== f.input && f.input.value !== display) {
        f.input.value = display;
      }
      f.dec.toggleAttribute('disabled', disabled || val === 0);
      f.inc.toggleAttribute('disabled', disabled || val === f.max);
    }
    if (this._hidden) this._hidden.value = this._iso() ?? '';
  }

  /** Update one unit of the internal duration, patch the DOM, and emit `change`. */
  private _set(unit: Unit, v: number | null): void {
    const parts: Record<Unit, number | null> = {
      hours: this._part('hours'),
      minutes: this._part('minutes'),
      seconds: this._withSec() ? this._part('seconds') : null,
    };
    parts[unit] = v;
    this._dur = (parts.hours === null && parts.minutes === null && parts.seconds === null)
      ? null
      : Temporal.Duration.from({
          hours: parts.hours ?? 0,
          minutes: parts.minutes ?? 0,
          seconds: parts.seconds ?? 0,
        });
    this._syncFields();
    this._dispatch();
  }

  private _withSec(): boolean { return this.boolAttr('with-seconds'); }

  protected build(): BuildResult {
    const raw = this.getAttribute('value');
    if (!this._initialized) {
      this._dur = this._parseDuration(raw ?? undefined);
      this._initialized = true;
    }

    const disabled = this.boolAttr('disabled');
    const size = this.attr('size', 'md');
    const status = this.attr('status');
    const name = this.attr('name');
    const withSeconds = this._withSec();

    const hoursLabel = this.attr('hours-label', 'Hours')!;
    const minutesLabel = this.attr('minutes-label', 'Minutes')!;
    const secondsLabel = this.attr('seconds-label', 'Seconds')!;

    const fieldClass = ['lily-number-input', size !== 'md' && `lily-number-input--${size}`]
      .filter(Boolean).join(' ');

    const root = h('div', {
      class: [
        'lily-duration-input',
        size !== 'md' && `lily-duration-input--${size}`,
        status && `lily-duration-input--${status}`,
      ],
    });

    // Hidden serialization input.
    this._hidden = null;
    if (name) {
      const hidden = h('input', {
        attrs: { type: 'hidden', name, value: this._iso() ?? '' },
      }) as HTMLInputElement;
      this._hidden = hidden;
      root.appendChild(hidden);
    }

    this._fields = [];

    const mkGroup = (
      unit: Unit,
      labelText: string,
      max: number,
      decLabel: string,
      incLabel: string,
    ): HTMLElement => {
      const val = this._part(unit);
      const uid = `lily-di-${Math.random().toString(36).slice(2, 7)}`;
      const group = h('div', { class: 'lily-duration-input__field-group' });

      const label = h('label', { class: 'lily-duration-input__label', attrs: { for: uid }, text: labelText });
      group.appendChild(label);

      const field = h('div', { class: fieldClass });

      const dec = h('button', { class: 'lily-number-input__btn', attrs: { type: 'button', 'aria-label': decLabel } });
      dec.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '−' }));
      if (disabled || val === 0) dec.setAttribute('disabled', '');
      // Read the current value at click time: the DOM is patched, not rebuilt,
      // so a value captured at build time would go stale.
      dec.addEventListener('click', () => this._set(unit, clampField((this._part(unit) ?? 0) - 1, max)));

      const input = h('input', {
        class: 'lily-number-input__field',
        attrs: {
          id: uid,
          type: 'number',
          inputmode: 'numeric',
          min: 0,
          max,
          'aria-label': labelText,
          value: val !== null ? pad2(val) : '',
          ...(disabled ? { disabled: '' } : {}),
        },
      }) as HTMLInputElement;

      input.addEventListener('input', () => {
        const rawInput = input.value;
        this._set(unit, rawInput === '' ? null : clampField(Number(rawInput), max));
      });

      // `_syncFields` leaves the focused input alone so typing isn't clobbered;
      // blur is the moment to settle the display onto the internal value
      // (clamped, e.g. "75" minutes → "59", and padded, e.g. "1" → "01").
      input.addEventListener('blur', () => this._syncFields());

      const inc = h('button', { class: 'lily-number-input__btn', attrs: { type: 'button', 'aria-label': incLabel } });
      inc.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '+' }));
      if (disabled || val === max) inc.setAttribute('disabled', '');
      inc.addEventListener('click', () => this._set(unit, clampField((this._part(unit) ?? 0) + 1, max)));

      field.append(dec, input, inc);
      group.appendChild(field);
      this._fields.push({ unit, max, input, dec, inc });
      return group;
    };

    const sep = () => h('span', { class: 'lily-duration-input__sep', attrs: { 'aria-hidden': 'true' }, text: ':' });

    root.appendChild(mkGroup('hours', hoursLabel, 999, 'Decrease hours', 'Increase hours'));
    root.appendChild(sep());
    root.appendChild(mkGroup('minutes', minutesLabel, 59, 'Decrease minutes', 'Increase minutes'));

    if (withSeconds) {
      root.appendChild(sep());
      root.appendChild(mkGroup('seconds', secondsLabel, 59, 'Decrease seconds', 'Increase seconds'));
    }

    return { root, slot: null };
  }
}
