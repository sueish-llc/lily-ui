import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  it('renders two labeled date fields', () => {
    render(<DateRangePicker startLabel="開始" endLabel="終了" />);
    expect(screen.getByRole('textbox', { name: '開始' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '終了' })).toBeInTheDocument();
  });
});
