import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tree } from './Tree';

describe('Tree', () => {
  const nodes = [
    { id: 'src', label: 'src', children: [{ id: 'index', label: 'index.ts' }, { id: 'app', label: 'app.tsx' }] },
    { id: 'readme', label: 'README.md' },
  ];

  it('expands a branch with ArrowRight and selects with Enter', async () => {
    const onSelect = vi.fn();
    render(<Tree aria-label="files" nodes={nodes} onSelect={onSelect} />);
    const root = screen.getByRole('treeitem', { name: /src/ });
    expect(root).toHaveAttribute('aria-expanded', 'false');
    root.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('src');
  });
});
