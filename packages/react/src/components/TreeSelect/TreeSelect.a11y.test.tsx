import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
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

describe('TreeSelect a11y', () => {
  it('has no violations when closed', async () => {
    const { container } = render(
      <TreeSelect nodes={nodes} aria-label="Category" placeholder="Select a category" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when open', async () => {
    const { container } = render(
      <TreeSelect nodes={nodes} aria-label="Category" placeholder="Select a category" />,
    );
    const trigger = container.querySelector('button')!;
    fireEvent.click(trigger);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const { container } = render(
      <TreeSelect nodes={nodes} aria-label="Category" disabled placeholder="Select a category" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with a selection', async () => {
    const { container } = render(
      <TreeSelect nodes={nodes} aria-label="Category" defaultValue="apple" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
