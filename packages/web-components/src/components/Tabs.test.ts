import { afterEach, describe, expect, it } from 'vitest';
import '../define';

const ITEMS = JSON.stringify([
  { id: 'one', label: 'One', content: 'First panel' },
  { id: 'two', label: 'Two', content: 'Second panel' },
  { id: 'three', label: 'Three', content: 'Third panel' },
]);

function mount(): HTMLElement {
  const el = document.createElement('lily-tabs');
  el.setAttribute('items', ITEMS);
  document.body.appendChild(el);
  return el;
}

function tabsOf(el: HTMLElement): HTMLButtonElement[] {
  return Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-tabs focus management', () => {
  it('moves DOM focus to the freshly rendered tab after ArrowRight', () => {
    const el = mount();
    const [first] = tabsOf(el);
    first!.focus();
    first!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );

    // The rerender rebuilt the tablist; focus must land on the *new* button.
    const tabs = tabsOf(el);
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('keeps focus on the active tab across Home/End jumps', () => {
    const el = mount();
    const [first] = tabsOf(el);
    first!.focus();
    first!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }),
    );

    const tabs = tabsOf(el);
    expect(tabs[2]!.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('focuses the newly rendered tab after click selection too', () => {
    const el = mount();
    tabsOf(el)[1]!.click();

    const tabs = tabsOf(el);
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
  });

  it('keeps focus on the new tab when a change handler mutates an observed attribute', () => {
    const el = mount();
    // A controlled-ish host reacting synchronously to `change` triggers another
    // rebuild; focus restoration must already be done (rerender before dispatch).
    el.addEventListener('change', () => el.setAttribute('label', 'updated'));

    const [first] = tabsOf(el);
    first!.focus();
    first!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );

    const tabs = tabsOf(el);
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabs[1]);
  });
});

describe('lily-tabs items replacement', () => {
  it('falls back to the first enabled tab when the active id disappears', () => {
    const el = mount();
    tabsOf(el)[1]!.click(); // active: 'two'

    el.setAttribute(
      'items',
      JSON.stringify([
        { id: 'x', label: 'X', content: '…', disabled: true },
        { id: 'y', label: 'Y', content: '…' },
        { id: 'z', label: 'Z', content: '…' },
      ]),
    );

    const tabs = tabsOf(el);
    // 'two' is gone: the first *enabled* tab must be active and reachable
    // (without the fallback every tab would keep tabindex="-1").
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('false');
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    expect(tabs[1]!.getAttribute('tabindex')).toBe('0');
  });

  it('keeps the active tab when it still exists after an items swap', () => {
    const el = mount();
    tabsOf(el)[1]!.click(); // active: 'two'

    el.setAttribute(
      'items',
      JSON.stringify([
        { id: 'two', label: 'Two', content: '…' },
        { id: 'four', label: 'Four', content: '…' },
      ]),
    );

    const tabs = tabsOf(el);
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
  });
});
