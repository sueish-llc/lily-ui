import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Combobox', () => {
  it('filters options and selects with the keyboard', async () => {
    const onChange = vi.fn();
    render(<Combobox aria-label="果物" options={fruits} onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: '果物' });
    await userEvent.type(input, 'an');
    // Only "Banana" matches "an".
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(input).toHaveValue('Banana');
  });

  it('marks expanded state', async () => {
    render(<Combobox aria-label="果物" options={fruits} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});
