import { afterEach, describe, expect, it } from 'vitest';
import '../define';

function selectsOf(el: HTMLElement): HTMLSelectElement[] {
  return Array.from(el.querySelectorAll('select'));
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-time-picker value attribute', () => {
  it('still renders when the value attribute is invalid', () => {
    const el = document.createElement('lily-time-picker');
    el.setAttribute('value', '9:99');
    expect(() => document.body.appendChild(el)).not.toThrow();

    expect(el.querySelector('.lily-time-picker')).not.toBeNull();
    // Invalid input is treated as "no value": both selects stay empty.
    const [hour, minute] = selectsOf(el);
    expect(hour!.value).toBe('');
    expect(minute!.value).toBe('');
  });

  it('reflects value attribute changes after the initial render', () => {
    const el = document.createElement('lily-time-picker');
    el.setAttribute('value', '09:30');
    document.body.appendChild(el);

    let [hour, minute] = selectsOf(el);
    expect(hour!.value).toBe('9');
    expect(minute!.value).toBe('30');

    el.setAttribute('value', '14:45');
    [hour, minute] = selectsOf(el);
    expect(hour!.value).toBe('14');
    expect(minute!.value).toBe('45');
  });

  it('clears the selection when the value attribute becomes invalid', () => {
    const el = document.createElement('lily-time-picker');
    el.setAttribute('value', '09:30');
    document.body.appendChild(el);

    el.setAttribute('value', 'not-a-time');
    const [hour, minute] = selectsOf(el);
    expect(hour!.value).toBe('');
    expect(minute!.value).toBe('');
  });

  it('reverts the selection when the host re-sets the same value string', () => {
    const el = document.createElement('lily-time-picker');
    el.setAttribute('value', '09:30');
    // A host that ignores the change and reverts: re-setting the *identical*
    // attribute string must still resync the internal selection.
    el.addEventListener('change', () => el.setAttribute('value', '09:30'));
    document.body.appendChild(el);

    const [hour] = selectsOf(el);
    hour!.value = '10';
    hour!.dispatchEvent(new Event('change', { bubbles: true }));

    const [h, m] = selectsOf(el);
    expect(h!.value).toBe('9');
    expect(m!.value).toBe('30');
  });

  it('patches a host revert in place so the operated select keeps focus', () => {
    const el = document.createElement('lily-time-picker');
    el.setAttribute('value', '09:30');
    el.addEventListener('change', () => el.setAttribute('value', '09:30'));
    document.body.appendChild(el);

    const [hour] = selectsOf(el);
    hour!.focus();
    hour!.value = '10';
    hour!.dispatchEvent(new Event('change', { bubbles: true }));

    // The revert must not rebuild the selects out from under the user.
    expect(hour!.isConnected).toBe(true);
    expect(document.activeElement).toBe(hour);
    expect(hour!.value).toBe('9');
  });
});

describe('lily-time-picker select display sync', () => {
  it('shows the autocompleted minute ("00") after picking only an hour', () => {
    const el = document.createElement('lily-time-picker');
    document.body.appendChild(el);
    let detail: string | null | undefined;
    el.addEventListener('change', (e) => {
      // The native select change also bubbles here; only the component's
      // CustomEvent carries the composed value.
      if (e instanceof CustomEvent) detail = (e as CustomEvent<string | null>).detail;
    });

    const [hour, minute] = selectsOf(el);
    hour!.value = '9';
    hour!.dispatchEvent(new Event('change', { bubbles: true }));

    // React renders minute "00" from the composed value; match it in place.
    expect(detail).toBe('09:00');
    expect(minute!.value).toBe('0');
    expect(minute!.isConnected).toBe(true);
  });

  it('shows the autocompleted hour after picking only a minute', () => {
    const el = document.createElement('lily-time-picker');
    document.body.appendChild(el);

    const [hour, minute] = selectsOf(el);
    minute!.value = '45';
    minute!.dispatchEvent(new Event('change', { bubbles: true }));

    expect(hour!.value).toBe('0');
    expect(minute!.value).toBe('45');
  });
});
