import { afterEach, describe, expect, it } from 'vitest';
import '../define';

function mount(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('lily-date-time-picker');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function openPopup(el: HTMLElement): void {
  el.querySelector<HTMLButtonElement>('.lily-date-time-picker__toggle')!.click();
}

function timeSelects(el: HTMLElement): HTMLSelectElement[] {
  return Array.from(el.querySelectorAll<HTMLSelectElement>('.lily-date-time-picker__time select'));
}

function fieldInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector<HTMLInputElement>('.lily-date-time-picker__input')!;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-date-time-picker grid selection focus', () => {
  it('keeps focus on the day button after selecting with Enter', () => {
    const el = mount({ value: '2026-05-20T09:30' });
    openPopup(el);

    // Opening moves focus to the day for the current value.
    const day20 = document.activeElement as HTMLButtonElement;
    expect(day20.getAttribute('data-date')).toBe('2026-05-20');

    // Arrow to the next day, then select it with Enter (the popup stays open).
    day20.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    const day21 = document.activeElement as HTMLButtonElement;
    expect(day21.getAttribute('data-date')).toBe('2026-05-21');

    day21.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
    );

    // Focus must stay on the (now selected) day — not fall to <body>.
    const active = document.activeElement as HTMLButtonElement;
    expect(active.classList.contains('lily-date-time-picker__day')).toBe(true);
    expect(active.getAttribute('data-date')).toBe('2026-05-21');
    expect(active.getAttribute('aria-pressed')).toBe('true');
    expect(fieldInput(el).value).toBe('2026-05-21 09:30');
  });

  it('keeps focus on the day button after selecting with click', () => {
    const el = mount({ value: '2026-05-20T09:30' });
    openPopup(el);

    const day21 = el.querySelector<HTMLButtonElement>('[data-date="2026-05-21"]')!;
    day21.focus();
    day21.click();

    const active = document.activeElement as HTMLButtonElement;
    expect(active.getAttribute('data-date')).toBe('2026-05-21');
    expect(active.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('lily-date-time-picker time selects', () => {
  it('patches the hour change in place so the select keeps focus', () => {
    const el = mount({ value: '2026-05-20T09:30' });
    openPopup(el);

    const [hourSel, minuteSel] = timeSelects(el);
    hourSel!.focus();
    hourSel!.value = '14';
    hourSel!.dispatchEvent(new Event('change', { bubbles: true }));

    // No rebuild: the same select stays connected and focused.
    expect(hourSel!.isConnected).toBe(true);
    expect(document.activeElement).toBe(hourSel);
    expect(hourSel!.value).toBe('14');
    expect(minuteSel!.value).toBe('30');

    // The field text and the grid selection are synced in place too.
    expect(fieldInput(el).value).toBe('2026-05-20 14:30');
    const day = el.querySelector<HTMLButtonElement>('[data-date="2026-05-20"]')!;
    expect(day.getAttribute('aria-pressed')).toBe('true');
  });

  it('keeps the select focused when a host reverts via the same value string', () => {
    const el = mount({ value: '2026-05-20T09:30' });
    // A host that ignores the change and re-sets the identical string.
    el.addEventListener('change', () => el.setAttribute('value', '2026-05-20T09:30'));
    openPopup(el);

    const [hourSel] = timeSelects(el);
    hourSel!.focus();
    hourSel!.value = '14';
    hourSel!.dispatchEvent(new Event('change', { bubbles: true }));

    expect(hourSel!.isConnected).toBe(true);
    expect(document.activeElement).toBe(hourSel);
    // The revert wins: display snaps back to the attribute's time.
    expect(hourSel!.value).toBe('9');
    expect(fieldInput(el).value).toBe('2026-05-20 09:30');
  });
});
