import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RangeDual } from './RangeDual';

describe('RangeDual', () => {
  it('clamps the low thumb so it cannot pass the high thumb', () => {
    const onChange = vi.fn();
    render(<RangeDual min={0} max={100} value={[20, 80]} onChange={onChange} />);
    fireEvent.change(screen.getAllByRole('slider')[0]!, { target: { value: '90' } });
    expect(onChange).toHaveBeenLastCalledWith([80, 80]);
  });

  it('clamps the high thumb so it cannot pass the low thumb', () => {
    const onChange = vi.fn();
    render(<RangeDual min={0} max={100} value={[20, 80]} onChange={onChange} />);
    fireEvent.change(screen.getAllByRole('slider')[1]!, { target: { value: '10' } });
    expect(onChange).toHaveBeenLastCalledWith([20, 20]);
  });

  it('labels both thumbs', () => {
    render(<RangeDual minLabel="下限" maxLabel="上限" defaultValue={[1, 9]} min={0} max={10} />);
    expect(screen.getByRole('slider', { name: '下限' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: '上限' })).toBeInTheDocument();
  });
});
