import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * `<lily-time-picker>` — pick a time from hour/minute (and optional AM/PM)
 * native selects. Parsing and composition use the **Temporal API**
 * (`Temporal.PlainTime`); the `value` attribute and the `change` event detail
 * are `"HH:MM"` strings.
 *
 * Attributes: `value` (`"HH:MM"`), `minute-step`, `hour12`, `disabled`,
 * `hour-label`, `minute-label`, `meridiem-label`, `id`.
 */
export class LilyTimePicker extends LilyElement {
  private value: Temporal.PlainTime | null = null;
  private initialized = false;
  // Whether the `value` attribute was (re)set since the last sync. Internal
  // selection wins, but every *attribute* write — including re-setting the
  // same string to revert an ignored change — resyncs the selects (the
  // `valueAttrDirty` pattern shared by the date/time pickers).
  private valueAttrDirty = false;
  // Live references to the built selects so a `value` attribute write can be
  // patched in place — a rebuild would replace the `<select>` being operated
  // and drop focus to `<body>`.
  private hourSelEl: HTMLSelectElement | null = null;
  private minuteSelEl: HTMLSelectElement | null = null;
  private meridiemSelEl: HTMLSelectElement | null = null;

  static get observedAttributes(): string[] {
    return ['value', 'minute-step', 'hour12', 'disabled', 'hour-label', 'minute-label', 'meridiem-label', 'id'];
  }

  attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    // `setAttribute` fires this even when the value is unchanged, which is how
    // a host reverts an ignored `change` (string comparison alone misses it).
    if (name === 'value') {
      this.valueAttrDirty = true;
      if (this.initialized && this.hourSelEl?.isConnected) {
        this.applyValueAttr();
        return;
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** Resync the internal value from the attribute, patching the selects in place. */
  private applyValueAttr(): void {
    if (!this.valueAttrDirty) return;
    this.valueAttrDirty = false;
    const raw = this.getAttribute('value');
    const parsed = raw ? safeParseTime(raw) : null;
    const same =
      parsed === null ? this.value === null : this.value !== null && parsed.equals(this.value);
    if (!same) {
      this.value = parsed;
      this.syncSelects();
    }
  }

  /**
   * Sync the select displays from the composed value (React re-renders the
   * selects from state, so e.g. picking only an hour shows minute "00", not
   * "--"). Patched in place — no rebuild, so the selects keep focus.
   */
  private syncSelects(): void {
    const { hourSelEl, minuteSelEl, meridiemSelEl } = this;
    if (!hourSelEl || !minuteSelEl) return;
    const hour12 = this.boolAttr('hour12');
    const hv = this.value ? this.value.hour : null;
    const mv = this.value ? this.value.minute : null;
    hourSelEl.value = hv == null ? '' : String(hour12 ? (hv % 12 === 0 ? 12 : hv % 12) : hv);
    minuteSelEl.value = mv == null ? '' : String(mv);
    if (meridiemSelEl) meridiemSelEl.value = hv != null && hv >= 12 ? 'PM' : 'AM';
  }

  protected build(): BuildResult {
    const raw = this.getAttribute('value');
    if (!this.initialized) {
      this.value = raw ? safeParseTime(raw) : null;
      this.initialized = true;
    } else if (this.valueAttrDirty) {
      // Resync whenever the parsed attribute differs from the internal value:
      // this also restores the attribute's time after a host "revert" that
      // re-sets the same string the attribute already had.
      const parsed = raw ? safeParseTime(raw) : null;
      const same =
        parsed === null ? this.value === null : this.value !== null && parsed.equals(this.value);
      if (!same) this.value = parsed;
    }
    this.valueAttrDirty = false;
    const minuteStep = this.numAttr('minute-step', 5);
    const hour12 = this.boolAttr('hour12');
    const disabled = this.boolAttr('disabled');
    const hVal = this.value ? this.value.hour : null;
    const mVal = this.value ? this.value.minute : null;
    const meridiem0 = hVal == null ? '' : hVal < 12 ? 'AM' : 'PM';
    const dispHours = hour12 ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 24 }, (_, i) => i);
    const dispHour = hVal == null ? '' : hour12 ? (hVal % 12 === 0 ? 12 : hVal % 12) : hVal;
    const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

    const root = h('div', { class: 'lily-time-picker', attrs: { id: this.attr('id') ?? null } });

    const mkSelect = (label: string, opts: { value: string; text: string }[], current: string): HTMLSelectElement => {
      const sel = h('select', { class: 'lily-select', attrs: { 'aria-label': label, disabled: disabled ? '' : null } }) as HTMLSelectElement;
      for (const o of opts) sel.appendChild(h('option', { attrs: { value: o.value }, text: o.text }));
      sel.value = current;
      return sel;
    };

    const hourSel = mkSelect(
      this.attr('hour-label', 'Hour')!,
      [{ value: '', text: '--' }, ...dispHours.map((hr) => ({ value: String(hr), text: pad2(hr) }))],
      dispHour === '' ? '' : String(dispHour),
    );
    const minuteSel = mkSelect(
      this.attr('minute-label', 'Minute')!,
      [{ value: '', text: '--' }, ...minutes.map((mn) => ({ value: String(mn), text: pad2(mn) }))],
      mVal == null ? '' : String(mVal),
    );
    const meridiemSel = hour12
      ? mkSelect(this.attr('meridiem-label', 'AM/PM')!, [
          { value: 'AM', text: 'AM' },
          { value: 'PM', text: 'PM' },
        ], meridiem0 || 'AM')
      : null;

    this.hourSelEl = hourSel;
    this.minuteSelEl = minuteSel;
    this.meridiemSelEl = meridiemSel;

    const compose = (nextH: number | null, nextM: number | null, nextMer: string) => {
      if (nextH == null && nextM == null) {
        this.value = null;
      } else {
        let h24 = nextH ?? 0;
        if (hour12) {
          h24 = (nextH ?? 12) % 12;
          if (nextMer === 'PM') h24 += 12;
        }
        this.value = Temporal.PlainTime.from({ hour: h24, minute: nextM ?? 0 });
      }
      this.syncSelects();
      const detail = this.value ? `${pad2(this.value.hour)}:${pad2(this.value.minute)}` : null;
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail }));
    };

    const hourArg = () => (hourSel.value === '' ? null : Number(hourSel.value));
    const minuteArg = () => (minuteSel.value === '' ? null : Number(minuteSel.value));
    const merArg = () => (meridiemSel ? meridiemSel.value : '');

    hourSel.addEventListener('change', () => compose(hourArg(), minuteArg(), merArg()));
    minuteSel.addEventListener('change', () => compose(hourArg(), minuteArg(), merArg()));
    meridiemSel?.addEventListener('change', () => compose(hourArg() ?? 12, minuteArg(), merArg()));

    root.append(hourSel, h('span', { class: 'lily-time-picker__sep', attrs: { 'aria-hidden': 'true' }, text: ':' }), minuteSel);
    if (meridiemSel) root.appendChild(meridiemSel);
    return { root, slot: null };
  }
}

/** Parse an `"HH:MM"` string via Temporal, returning `null` when invalid. */
function safeParseTime(raw: string): Temporal.PlainTime | null {
  try {
    return Temporal.PlainTime.from(raw, { overflow: 'reject' });
  } catch {
    return null;
  }
}
