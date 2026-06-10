import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthPicker } from './MonthPicker';

function openPicker() {
  return userEvent.click(screen.getByRole('button', { name: /Choose month/ }));
}

describe('MonthPicker', () => {
  it('shows the selected month on the trigger', () => {
    render(<MonthPicker value={Temporal.PlainYearMonth.from('2026-05')} locale="en-US" />);
    expect(screen.getByRole('button', { name: /May 2026/ })).toBeInTheDocument();
  });

  it('opens the dialog and shows the year grid', async () => {
    render(<MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} locale="en-US" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await openPicker();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('2026')).toBeInTheDocument();
  });

  it('selects a month and reports a PlainYearMonth', async () => {
    const onChange = vi.fn();
    render(
      <MonthPicker
        defaultValue={Temporal.PlainYearMonth.from('2026-05')}
        locale="en-US"
        onChange={onChange}
      />,
    );
    await openPicker();
    await userEvent.click(screen.getByRole('button', { name: 'August 2026' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainYearMonth).toString()).toBe('2026-08');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates years with the header buttons', async () => {
    render(<MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} locale="en-US" />);
    await openPicker();
    await userEvent.click(screen.getByRole('button', { name: 'Previous year' }));
    expect(screen.getByText('2025')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next year' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next year' }));
    expect(screen.getByText('2027')).toBeInTheDocument();
  });

  it('moves focus with arrow keys and selects with Enter', async () => {
    const onChange = vi.fn();
    render(
      <MonthPicker
        defaultValue={Temporal.PlainYearMonth.from('2026-05')}
        locale="en-US"
        onChange={onChange}
      />,
    );
    await openPicker();
    expect(screen.getByRole('button', { name: 'May 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}'); // +1 month, +3 months => September
    await userEvent.keyboard('{Enter}');
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainYearMonth).toString()).toBe('2026-09');
  });

  it('does not allow selecting months outside [min, max]', async () => {
    const onChange = vi.fn();
    render(
      <MonthPicker
        defaultValue={Temporal.PlainYearMonth.from('2026-05')}
        min="2026-03"
        max="2026-09"
        locale="en-US"
        onChange={onChange}
      />,
    );
    await openPicker();
    const jan = screen.getByRole('button', { name: 'January 2026' });
    expect(jan).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(jan);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    render(<MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} locale="en-US" />);
    await openPicker();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /May 2026/ })).toHaveFocus();
  });

  it('disables the trigger when `disabled`', () => {
    render(<MonthPicker disabled defaultValue={Temporal.PlainYearMonth.from('2026-05')} />);
    expect(screen.getByRole('button', { name: /Choose month/ })).toBeDisabled();
  });

  it('reuses cached Intl.DateTimeFormat instances instead of constructing per render', async () => {
    const Original = Intl.DateTimeFormat;
    let constructions = 0;
    function Counting(...args: ConstructorParameters<typeof Intl.DateTimeFormat>) {
      constructions += 1;
      return new Original(...args);
    }
    Counting.prototype = Original.prototype;
    Object.setPrototypeOf(Counting, Original); // keep statics (supportedLocalesOf)
    Intl.DateTimeFormat = Counting as unknown as typeof Intl.DateTimeFormat;
    try {
      const { rerender } = render(
        <MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} locale="en-US" />,
      );
      await openPicker(); // the open grid formats 12+ month labels
      const afterFirstRender = constructions;
      rerender(
        <MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} locale="en-US" />,
      );
      expect(constructions).toBe(afterFirstRender);
    } finally {
      Intl.DateTimeFormat = Original;
    }
  });
});
