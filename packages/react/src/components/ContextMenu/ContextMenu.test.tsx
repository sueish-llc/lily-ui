/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- test trigger surface is focusable so the keyboard path can be exercised */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from './ContextMenu';

function setup(onSelect = vi.fn()) {
  render(
    <ContextMenu
      menu={
        <>
          <ContextMenu.Item onSelect={onSelect}>Cut</ContextMenu.Item>
          <ContextMenu.Divider />
          <ContextMenu.Item disabled>Disabled</ContextMenu.Item>
          <ContextMenu.Item>Delete</ContextMenu.Item>
        </>
      }
    >
      <div data-testid="area" tabIndex={0}>
        area
      </div>
    </ContextMenu>,
  );
  return { onSelect, area: screen.getByTestId('area') };
}

describe('ContextMenu', () => {
  it('renders a hidden role=menu with menuitem children', () => {
    setup();
    const menu = screen.getByRole('menu', { hidden: true });
    expect(menu).toHaveClass('lily-context-menu__menu');
    expect(menu).toHaveAttribute('hidden');
    expect(screen.getAllByRole('menuitem', { hidden: true })).toHaveLength(3);
  });

  it('opens at the pointer on contextmenu and positions the menu', () => {
    const { area } = setup();
    fireEvent.contextMenu(area, { clientX: 40, clientY: 60 });
    const menu = screen.getByRole('menu');
    expect(menu).not.toHaveAttribute('hidden');
    expect(menu).toHaveStyle({ left: '40px', top: '60px' });
  });

  it('opens via Shift+F10 and the ContextMenu key', () => {
    const { area } = setup();
    fireEvent.keyDown(area, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(area, { key: 'ContextMenu' });
    expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
  });

  it('moves roving focus with Arrow keys, skipping disabled items', () => {
    const { area } = setup();
    fireEvent.contextMenu(area, { clientX: 0, clientY: 0 });
    const menu = screen.getByRole('menu');
    const enabled = screen
      .getAllByRole('menuitem')
      .filter((el) => el.getAttribute('aria-disabled') !== 'true');
    expect(enabled[0]).toHaveFocus(); // first item auto-focused
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(enabled[1]).toHaveFocus(); // skipped the disabled one
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(enabled[0]).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'End' });
    expect(enabled[enabled.length - 1]).toHaveFocus();
  });

  it('activates an item on click and closes', () => {
    const { area, onSelect } = setup();
    fireEvent.contextMenu(area, { clientX: 0, clientY: 0 });
    fireEvent.click(screen.getByRole('menuitem', { name: 'Cut' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('hidden');
  });

  it('closes on Escape', () => {
    const { area } = setup();
    fireEvent.contextMenu(area, { clientX: 0, clientY: 0 });
    expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('hidden');
  });
});
