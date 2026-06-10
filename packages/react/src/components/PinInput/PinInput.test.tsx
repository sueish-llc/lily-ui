import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinInput } from './PinInput';

describe('PinInput', () => {
  it('auto-advances and reports completion', async () => {
    const onComplete = vi.fn();
    render(<PinInput length={4} onComplete={onComplete} label="コード" />);
    const cells = screen.getAllByRole('textbox');
    expect(cells).toHaveLength(4);
    await userEvent.click(cells[0]!);
    await userEvent.keyboard('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('ignores non-numeric input in numeric mode', async () => {
    render(<PinInput length={3} label="コード" />);
    const cells = screen.getAllByRole('textbox');
    await userEvent.click(cells[0]!);
    await userEvent.keyboard('a');
    expect(cells[0]).toHaveValue('');
  });
});
