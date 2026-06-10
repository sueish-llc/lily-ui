import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  it('composes a Temporal.PlainTime from the selects', async () => {
    const onChange = vi.fn();
    render(<TimePicker minuteStep={15} onChange={onChange} hourLabel="時" minuteLabel="分" />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: '時' }), '9');
    expect(onChange.mock.calls.at(-1)![0]).toBeInstanceOf(Temporal.PlainTime);
    expect(onChange.mock.calls.at(-1)![0].toString()).toBe('09:00:00');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: '分' }), '30');
    expect(onChange.mock.calls.at(-1)![0].toString()).toBe('09:30:00');
  });

  it('supports 12-hour mode with AM/PM', () => {
    render(<TimePicker hour12 value={Temporal.PlainTime.from('13:00')} hourLabel="時" meridiemLabel="午前午後" />);
    expect(screen.getByRole('combobox', { name: '時' })).toHaveValue('1');
    expect(screen.getByRole('combobox', { name: '午前午後' })).toHaveValue('PM');
  });
});
