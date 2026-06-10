import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl';

const segOptions = [
  { value: 'list', label: 'リスト' },
  { value: 'grid', label: 'グリッド' },
];

describe('SegmentedControl', () => {
  it('selects an option and fires onChange', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl aria-label="表示" options={segOptions} defaultValue="list" onChange={onChange} />);
    expect(screen.getByRole('radiogroup', { name: '表示' })).toBeInTheDocument();
    const grid = screen.getByRole('radio', { name: 'グリッド' });
    await userEvent.click(grid);
    expect(onChange).toHaveBeenCalledWith('grid');
    expect(grid).toBeChecked();
  });
});
