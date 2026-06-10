import { afterEach, describe, expect, it } from 'vitest';
import '../define';

const NODES = JSON.stringify([
  { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }] },
  { id: 'b', label: 'B' },
]);

function mountOpen(): HTMLElement {
  const el = document.createElement('lily-tree-select');
  el.setAttribute('nodes', NODES);
  document.body.appendChild(el);
  el.querySelector<HTMLButtonElement>('.lily-tree-select__trigger')!.click();
  return el;
}

function firstItem(el: HTMLElement): HTMLLIElement {
  return el.querySelector<HTMLLIElement>('[role="treeitem"]')!;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('lily-tree-select keyboard expand/collapse', () => {
  it('refocuses the node after ArrowRight expands it', () => {
    const el = mountOpen();
    const item = firstItem(el);
    item.focus();
    item.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );

    // The rerender rebuilt the tree; focus must land on the *new* node.
    const fresh = firstItem(el);
    expect(fresh).not.toBe(item);
    expect(fresh.getAttribute('aria-expanded')).toBe('true');
    expect(fresh.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(fresh);
  });

  it('refocuses the node after ArrowLeft collapses it', () => {
    const el = mountOpen();
    let item = firstItem(el);
    item.focus();
    item.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );

    item = firstItem(el);
    item.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }),
    );

    const fresh = firstItem(el);
    expect(fresh.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(fresh);
  });
});
