import { afterEach, describe, expect, it } from 'vitest';
import '../define';

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('lily-duration-input');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function hourInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector<HTMLInputElement>('.lily-number-input__field')!;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-duration-input typing', () => {
  it('keeps focus in the input across consecutive keystrokes (two-digit entry)', () => {
    const el = mount();
    const details: (string | null)[] = [];
    el.addEventListener('change', (e) => details.push((e as CustomEvent<string | null>).detail));

    const input = hourInput(el);
    input.focus();
    input.value = '1';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // The input must survive the first keystroke (no rebuild) …
    expect(input.isConnected).toBe(true);
    expect(document.activeElement).toBe(input);

    // … so the second digit lands in the same field.
    input.value = '12';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('12');
    expect(details).toEqual(['PT1H0M0S', 'PT12H0M0S']);
  });

  it('keeps focus when a controlled host echoes the value attribute on change', () => {
    const el = mount({ value: 'PT0H0M0S' });
    el.addEventListener('change', (e) => {
      const detail = (e as CustomEvent<string | null>).detail;
      if (detail) el.setAttribute('value', detail);
      else el.removeAttribute('value');
    });

    const input = hourInput(el);
    input.focus();
    input.value = '3';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = '34';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(input.isConnected).toBe(true);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('34');
  });
});

describe('lily-duration-input steppers', () => {
  it('reads the current value on every click (the DOM is patched, not rebuilt)', () => {
    const el = mount({ name: 'dur' });
    const inc = el.querySelector<HTMLButtonElement>('[aria-label="Increase hours"]')!;
    inc.click();
    inc.click();

    // Same buttons/inputs throughout; the display and hidden value are synced.
    expect(el.querySelector('[aria-label="Increase hours"]')).toBe(inc);
    expect(hourInput(el).value).toBe('02');
    expect(el.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe('PT2H0M0S');
  });

  it('updates the decrease button disabled state in place', () => {
    const el = mount();
    const dec = el.querySelector<HTMLButtonElement>('[aria-label="Decrease hours"]')!;
    const inc = el.querySelector<HTMLButtonElement>('[aria-label="Increase hours"]')!;
    inc.click(); // 1 hour
    expect(dec.hasAttribute('disabled')).toBe(false);
    dec.click(); // back to 0 hours
    expect(dec.hasAttribute('disabled')).toBe(true);
  });
});

describe('lily-duration-input blur', () => {
  it('snaps the display back to the clamped internal value on blur', () => {
    const el = mount();
    const details: (string | null)[] = [];
    el.addEventListener('change', (e) => details.push((e as CustomEvent<string | null>).detail));

    const minutes = el.querySelectorAll<HTMLInputElement>('.lily-number-input__field')[1]!;
    minutes.focus();
    minutes.value = '75';
    minutes.dispatchEvent(new Event('input', { bubbles: true }));

    // While focused the raw text is left alone (typing must not be clobbered) …
    expect(details).toEqual(['PT0H59M0S']);
    expect(minutes.value).toBe('75');

    // … but blur settles the display onto the clamped internal value.
    minutes.blur();
    expect(minutes.value).toBe('59');
  });

  it('pads a single digit to two on blur', () => {
    const el = mount();
    const input = hourInput(el);
    input.focus();
    input.value = '1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(input.value).toBe('1');

    input.blur();
    expect(input.value).toBe('01');
  });
});

describe('lily-duration-input value attribute', () => {
  it('resyncs the fields when the value attribute changes externally', () => {
    const el = mount({ value: 'PT1H5M0S' });
    expect(hourInput(el).value).toBe('01');
    el.setAttribute('value', 'PT2H45M0S');
    const inputs = el.querySelectorAll<HTMLInputElement>('.lily-number-input__field');
    expect(inputs[0]!.value).toBe('02');
    expect(inputs[1]!.value).toBe('45');
  });

  it('lets a host revert an internal edit by re-setting the same value string', () => {
    const el = mount({ value: 'PT2H0M0S' });
    // A host that ignores the change: re-setting the *identical* attribute
    // string must still resync the fields (dirty semantics, not string diff).
    el.addEventListener('change', () => el.setAttribute('value', 'PT2H0M0S'));

    el.querySelector<HTMLButtonElement>('[aria-label="Increase hours"]')!.click();
    expect(hourInput(el).value).toBe('02');
  });
});
