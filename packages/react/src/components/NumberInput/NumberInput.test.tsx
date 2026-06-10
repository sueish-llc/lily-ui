import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('increments and decrements within bounds', async () => {
    const onChange = vi.fn();
    render(<NumberInput aria-label="数量" min={0} max={2} defaultValue={1} onChange={onChange} />);
    const inc = screen.getByRole('button', { name: 'Increase' });
    const dec = screen.getByRole('button', { name: 'Decrease' });
    await userEvent.click(inc);
    expect(onChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(dec);
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('disables the increment button at the maximum', () => {
    render(<NumberInput aria-label="x" min={0} max={2} value={2} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('exposes a spinbutton', () => {
    render(<NumberInput aria-label="量" defaultValue={3} />);
    expect(screen.getByRole('spinbutton', { name: '量' })).toHaveValue(3);
  });
});
