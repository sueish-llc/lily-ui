import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Transfer } from './Transfer';

describe('Transfer', () => {
  const items = [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
    { value: 'c', label: 'Cherry' },
  ];

  it('moves checked items to the target list', async () => {
    const onChange = vi.fn();
    render(<Transfer items={items} titles={['候補', '選択済み']} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Apple'));
    await userEvent.click(screen.getByRole('button', { name: 'Add selected' }));
    expect(onChange).toHaveBeenLastCalledWith(['a']);
  });
});
