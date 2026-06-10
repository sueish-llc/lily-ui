import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';
import { toPlainDate } from '../../utils/datetime';

describe('Calendar', () => {
  it('selects a day and marks it pressed', async () => {
    const onChange = vi.fn();
    render(<Calendar defaultValue={toPlainDate('2026-05-15')} onChange={onChange} locale="en-US" />);
    const day = screen.getByRole('button', { name: /May 20, 2026/ });
    await userEvent.click(day);
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0]![0].day).toBe(20);
  });

  it('navigates months', async () => {
    render(<Calendar defaultValue={toPlainDate('2026-05-15')} locale="en-US" />);
    expect(screen.getByText(/May 2026/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '次の月' }));
    expect(screen.getByText(/June 2026/)).toBeInTheDocument();
  });

  it('disables days outside valid min/max bounds', () => {
    render(
      <Calendar
        defaultValue={toPlainDate('2026-05-15')}
        min="2026-05-10"
        max="2026-05-20"
        locale="en-US"
      />,
    );
    expect(screen.getByRole('button', { name: /May 5, 2026/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /May 15, 2026/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /May 25, 2026/ })).toBeDisabled();
  });

  it('does not throw when min/max are invalid ISO strings (they are ignored)', () => {
    expect(() =>
      render(
        <Calendar
          defaultValue={toPlainDate('2026-05-15')}
          min="not-a-date"
          max="2026-13-45"
          locale="en-US"
        />,
      ),
    ).not.toThrow();
    // Invalid bounds behave as "no bound": days remain selectable.
    expect(screen.getByRole('button', { name: /May 20, 2026/ })).toBeEnabled();
  });
});
