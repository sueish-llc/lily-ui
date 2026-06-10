import { afterEach, describe, expect, it } from 'vitest';
import '../define';

function pressed(el: HTMLElement): HTMLButtonElement | null {
  return el.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-calendar value attribute', () => {
  it('reflects value attribute changes after initialization (controlled)', () => {
    const el = document.createElement('lily-calendar');
    el.setAttribute('value', '2026-05-31');
    document.body.appendChild(el);
    expect(pressed(el)?.textContent).toBe('31');

    el.setAttribute('value', '2026-05-15');
    expect(pressed(el)?.textContent).toBe('15');
  });

  it('clears the selection when the value attribute is removed', () => {
    const el = document.createElement('lily-calendar');
    el.setAttribute('value', '2026-05-31');
    document.body.appendChild(el);

    el.removeAttribute('value');
    expect(pressed(el)).toBeNull();
  });

  it('lets a host revert an internal selection by re-setting the value attribute', () => {
    const el = document.createElement('lily-calendar');
    el.setAttribute('value', '2026-05-10');
    document.body.appendChild(el);

    // Pick another in-month day internally…
    const day15 = Array.from(el.querySelectorAll<HTMLButtonElement>('.lily-calendar__day')).find(
      (b) => !b.classList.contains('lily-calendar__day--outside') && b.textContent === '15',
    )!;
    day15.click();
    expect(pressed(el)?.textContent).toBe('15');

    // …then drive it back from the attribute.
    el.setAttribute('value', '2026-05-20');
    expect(pressed(el)?.textContent).toBe('20');
  });

  it('reverts the selection when the host re-sets the same value string', () => {
    const el = document.createElement('lily-calendar');
    el.setAttribute('value', '2026-05-10');
    // A host that ignores the change and reverts: re-setting the *identical*
    // attribute string must still resync the internal selection.
    el.addEventListener('change', () => el.setAttribute('value', '2026-05-10'));
    document.body.appendChild(el);

    const day15 = Array.from(el.querySelectorAll<HTMLButtonElement>('.lily-calendar__day')).find(
      (b) => !b.classList.contains('lily-calendar__day--outside') && b.textContent === '15',
    )!;
    day15.click();

    expect(pressed(el)?.textContent).toBe('10');
  });
});

describe('lily-calendar selection focus', () => {
  it('keeps focus on the selected day button after a click rerender', () => {
    const el = document.createElement('lily-calendar');
    el.setAttribute('value', '2026-05-10');
    document.body.appendChild(el);

    const day15 = Array.from(el.querySelectorAll<HTMLButtonElement>('.lily-calendar__day')).find(
      (b) => !b.classList.contains('lily-calendar__day--outside') && b.textContent === '15',
    )!;
    day15.focus();
    day15.click();

    // The rebuild replaced the clicked button; focus must land on its
    // successor (the now selected day), not on <body>.
    const active = document.activeElement as HTMLButtonElement;
    expect(active.classList.contains('lily-calendar__day')).toBe(true);
    expect(active.getAttribute('aria-pressed')).toBe('true');
    expect(active.textContent).toBe('15');
  });
});
