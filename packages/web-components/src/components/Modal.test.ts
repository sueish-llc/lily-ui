import { afterEach, describe, expect, it } from 'vitest';
import '../define';

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-modal data-state', () => {
  it('reflects open/closed on the dialog element itself, not only the backdrop', () => {
    const el = document.createElement('lily-modal');
    el.setAttribute('title', 'Confirm');
    el.append(document.createTextNode('Are you sure?'));
    document.body.appendChild(el);

    el.setAttribute('open', '');
    const backdrop = document.body.querySelector<HTMLElement>('.lily-backdrop');
    const dialog = document.body.querySelector<HTMLElement>('.lily-modal');
    expect(backdrop?.getAttribute('data-state')).toBe('open');
    expect(dialog?.getAttribute('data-state')).toBe('open');

    el.removeAttribute('open');
    // Mirrors the React Modal: while exiting, both backdrop *and* dialog carry
    // data-state="closed" so CSS can animate the dialog out.
    expect(backdrop?.getAttribute('data-state')).toBe('closed');
    expect(dialog?.getAttribute('data-state')).toBe('closed');
  });
});
