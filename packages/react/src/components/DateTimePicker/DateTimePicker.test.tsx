import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTimePicker } from './DateTimePicker';

function getInput() {
  return screen.getByRole('textbox');
}
function openPicker() {
  return userEvent.click(screen.getByRole('button', { name: 'Choose date and time' }));
}

describe('DateTimePicker', () => {
  it('renders the selected date and time in the field', () => {
    render(<DateTimePicker value={Temporal.PlainDateTime.from('2026-05-30T09:30')} />);
    expect(getInput()).toHaveValue('2026-05-30 09:30');
  });

  it('opens the dialog from the toggle button', async () => {
    render(<DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await openPicker();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('May 2026')).toBeInTheDocument();
  });

  it('selects a day, keeping the current time, and reports a PlainDateTime', async () => {
    const onChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')}
        onChange={onChange}
      />,
    );
    await openPicker();
    await userEvent.click(screen.getByRole('button', { name: /May 15, 2026/ }));
    const arg = onChange.mock.lastCall?.[0] as Temporal.PlainDateTime;
    expect(arg.toString()).toBe('2026-05-15T09:30:00');
  });

  it('changes the time via the hour and minute steppers', async () => {
    const onChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')}
        onChange={onChange}
      />,
    );
    await openPicker();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Hour' }), '14');
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainDateTime).toString()).toBe(
      '2026-05-30T14:30:00',
    );
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Minute' }), '45');
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainDateTime).toString()).toBe(
      '2026-05-30T14:45:00',
    );
  });

  it('moves the focused day with arrow keys and selects with Enter', async () => {
    const onChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={Temporal.PlainDateTime.from('2026-05-15T08:00')}
        onChange={onChange}
      />,
    );
    await openPicker();
    expect(screen.getByRole('button', { name: /May 15, 2026/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}'); // +1 day, +7 days => 23rd
    await userEvent.keyboard('{Enter}');
    expect((onChange.mock.lastCall?.[0] as Temporal.PlainDateTime).toString()).toBe(
      '2026-05-23T08:00:00',
    );
  });

  it('navigates months with the header buttons', async () => {
    render(<DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')} />);
    await openPicker();
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('April 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('June 2026')).toBeInTheDocument();
  });

  it('does not allow selecting days outside [min, max]', async () => {
    const onChange = vi.fn();
    render(
      <DateTimePicker
        defaultValue={Temporal.PlainDateTime.from('2026-05-15T09:00')}
        min="2026-05-10T00:00"
        max="2026-05-20T23:59"
        onChange={onChange}
      />,
    );
    await openPicker();
    const may5 = screen.getByRole('button', { name: /May 5, 2026/ });
    expect(may5).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(may5);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    render(<DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-15T09:30')} />);
    await openPicker();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose date and time' })).toHaveFocus();
  });

  it('disables the whole control when `disabled`', () => {
    render(<DateTimePicker disabled defaultValue={Temporal.PlainDateTime.from('2026-05-15T09:30')} />);
    expect(getInput()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose date and time' })).toBeDisabled();
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
        <DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-15T09:30')} locale="en-US" />,
      );
      await openPicker(); // the open calendar formats ~57 labels per render
      const afterFirstRender = constructions;
      rerender(
        <DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-15T09:30')} locale="en-US" />,
      );
      expect(constructions).toBe(afterFirstRender);
    } finally {
      Intl.DateTimeFormat = Original;
    }
  });
});
