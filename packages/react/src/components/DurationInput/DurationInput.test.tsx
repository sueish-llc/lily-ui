import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DurationInput } from './DurationInput';

describe('DurationInput', () => {
  it('renders Hours and Minutes fields', () => {
    render(<DurationInput />);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('does not render a Seconds field by default', () => {
    render(<DurationInput />);
    expect(screen.queryByRole('spinbutton', { name: 'Seconds' })).not.toBeInTheDocument();
  });

  it('renders a Seconds field when withSeconds is true', () => {
    render(<DurationInput withSeconds />);
    expect(screen.getByRole('spinbutton', { name: 'Seconds' })).toBeInTheDocument();
  });

  it('displays a supplied defaultValue', () => {
    const dur = Temporal.Duration.from({ hours: 2, minutes: 30 });
    render(<DurationInput defaultValue={dur} />);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(2);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(30);
  });

  it('calls onChange when the hours field changes', async () => {
    const onChange = vi.fn();
    render(<DurationInput onChange={onChange} />);
    const hoursInput = screen.getByRole('spinbutton', { name: 'Hours' });
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '3');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.lastCall?.[0] as Temporal.Duration;
    expect(lastCall?.hours).toBe(3);
  });

  it('disables all inputs when disabled', () => {
    render(<DurationInput disabled defaultValue={Temporal.Duration.from({ hours: 1, minutes: 0 })} />);
    const inputs = screen.getAllByRole('spinbutton');
    for (const input of inputs) {
      expect(input).toBeDisabled();
    }
  });

  it('increments hours via the + button', async () => {
    render(<DurationInput defaultValue={Temporal.Duration.from({ hours: 1, minutes: 0 })} />);
    const incBtn = screen.getByRole('button', { name: 'Increase hours' });
    await userEvent.click(incBtn);
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(2);
  });

  it('decrements minutes via the − button', async () => {
    render(<DurationInput defaultValue={Temporal.Duration.from({ hours: 0, minutes: 10 })} />);
    const decBtn = screen.getByRole('button', { name: 'Decrease minutes' });
    await userEvent.click(decBtn);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(9);
  });

  it('applies size modifier class', () => {
    const { container } = render(<DurationInput size="lg" />);
    expect(container.firstChild).toHaveClass('lily-duration-input--lg');
  });

  it('accepts custom field labels', () => {
    render(<DurationInput hoursLabel="Stunden" minutesLabel="Minuten" />);
    expect(screen.getByRole('spinbutton', { name: 'Stunden' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Minuten' })).toBeInTheDocument();
  });
});
