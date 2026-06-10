import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TreeSelect } from './TreeSelect';
import type { TreeNode } from '../Tree/Tree';

const nodes: TreeNode[] = [
  {
    id: 'fruits',
    label: 'Fruits',
    children: [
      { id: 'apple', label: 'Apple' },
      { id: 'banana', label: 'Banana' },
    ],
  },
  { id: 'veggies', label: 'Veggies' },
];

describe('TreeSelect', () => {
  it('renders the trigger button', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick one" />);
    expect(screen.getByRole('button', { name: 'Category' })).not.toBeNull();
  });

  it('shows placeholder when nothing is selected', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).not.toBeNull();
  });

  it('shows selected label when a value is set', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" defaultValue="veggies" />);
    // The panel is closed (hidden), so the only visible "Veggies" is the trigger label.
    expect(screen.getByRole('button').textContent).toContain('Veggies');
  });

  it('opens the panel on click', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick" />);
    const trigger = screen.getByRole('button', { name: 'Category' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the panel after selecting in single mode', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick" />);
    const trigger = screen.getByRole('button', { name: 'Category' });
    fireEvent.click(trigger);
    // Panel is open; pick Veggies
    const veggies = screen.getByText('Veggies');
    fireEvent.click(veggies);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not open when disabled', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick" disabled />);
    const trigger = screen.getByRole('button', { name: 'Category' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on ArrowDown key', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick" />);
    const trigger = screen.getByRole('button', { name: 'Category' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes on Escape key from trigger', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" placeholder="Pick" />);
    const trigger = screen.getByRole('button', { name: 'Category' });
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('applies size modifier', () => {
    render(<TreeSelect nodes={nodes} aria-label="Category" size="lg" />);
    const trigger = screen.getByRole('button', { name: 'Category' });
    expect(trigger.classList.contains('lily-tree-select__trigger--lg')).toBe(true);
  });

  it('applies the root class', () => {
    const { container } = render(<TreeSelect nodes={nodes} aria-label="Category" />);
    expect(container.querySelector('.lily-tree-select')).not.toBeNull();
  });
});
