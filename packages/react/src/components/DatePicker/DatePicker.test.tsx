import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';

function getInput() {
  return screen.getByRole('textbox');
}
function openCalendar() {
  return userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
}

describe('DatePicker', () => {
  it('renders the ISO value of a controlled date in the field', () => {
    render(<DatePicker value={Temporal.PlainDate.from('2026-05-30')} />);
    expect(getInput()).toHaveValue('2026-05-30');
  });

  it('opens the calendar dialog from the toggle button', async () => {
    render(<DatePicker defaultValue={Temporal.PlainDate.from('2026-05-30')} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await openCalendar();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('May 2026')).toBeInTheDocument();
  });

  it('selects a day and reports it via onChange', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker defaultValue={Temporal.PlainDate.from('2026-05-30')} onChange={onChange} />,
    );
    await openCalendar();
    await userEvent.click(screen.getByRole('button', { name: /May 15, 2026/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const arg = onChange.mock.lastCall?.[0] as Temporal.PlainDate;
    expect(arg.toString()).toBe('2026-05-15');
    expect(getInput()).toHaveValue('2026-05-15');
    // Selecting closes the popup.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('parses a typed ISO date on Enter', async () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await userEvent.type(getInput(), '2026-12-25{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything());
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainDate).toString()).toBe('2026-12-25');
  });

  it('flags invalid typed input without changing the value', async () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await userEvent.type(getInput(), '2026-13-40{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears the value when the field is emptied', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker defaultValue={Temporal.PlainDate.from('2026-05-30')} onChange={onChange} />,
    );
    const input = getInput();
    await userEvent.clear(input);
    await userEvent.tab(); // commit on blur
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('navigates months with the header buttons', async () => {
    render(<DatePicker defaultValue={Temporal.PlainDate.from('2026-05-30')} />);
    await openCalendar();
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('April 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('June 2026')).toBeInTheDocument();
  });

  it('moves the focused day with arrow keys and selects with Enter', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker defaultValue={Temporal.PlainDate.from('2026-05-15')} onChange={onChange} />,
    );
    await openCalendar();
    // The selected day starts focused.
    expect(screen.getByRole('button', { name: /May 15, 2026/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}'); // +1 day, +7 days => 23rd
    await userEvent.keyboard('{Enter}');
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainDate).toString()).toBe('2026-05-23');
  });

  it('does not allow selecting dates outside [min, max]', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue={Temporal.PlainDate.from('2026-05-15')}
        min="2026-05-10"
        max="2026-05-20"
        onChange={onChange}
      />,
    );
    await openCalendar();
    const may5 = screen.getByRole('button', { name: /May 5, 2026/ });
    expect(may5).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(may5);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    render(<DatePicker defaultValue={Temporal.PlainDate.from('2026-05-15')} />);
    await openCalendar();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose date' })).toHaveFocus();
  });

  it('disables the whole control when `disabled`', () => {
    render(<DatePicker disabled defaultValue={Temporal.PlainDate.from('2026-05-15')} />);
    expect(getInput()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeDisabled();
  });
});
