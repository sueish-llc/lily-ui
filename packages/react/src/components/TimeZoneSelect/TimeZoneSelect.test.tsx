import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeZoneSelect } from './TimeZoneSelect';

describe('TimeZoneSelect', () => {
  it('renders a native select with the lily-select class', () => {
    render(<TimeZoneSelect zones={['UTC', 'Asia/Tokyo']} defaultValue="UTC" />);
    expect(screen.getByRole('combobox')).toHaveClass('lily-select');
  });

  it('shows the controlled value as selected', () => {
    render(<TimeZoneSelect zones={['UTC', 'Asia/Tokyo']} value="Asia/Tokyo" />);
    expect(screen.getByRole('combobox')).toHaveValue('Asia/Tokyo');
  });

  it('reports the selected IANA id via onChange', async () => {
    const onChange = vi.fn();
    render(
      <TimeZoneSelect
        zones={['UTC', 'Asia/Tokyo', 'Europe/London']}
        defaultValue="UTC"
        onChange={onChange}
      />,
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Europe/London');
    expect(onChange).toHaveBeenLastCalledWith('Europe/London');
  });

  it('renders a disabled placeholder option when provided', () => {
    render(
      <TimeZoneSelect zones={['UTC', 'Asia/Tokyo']} placeholder="Select a time zone" />,
    );
    const placeholder = screen.getByRole('option', { name: 'Select a time zone' });
    expect(placeholder).toBeDisabled();
  });

  it('falls back to a static list when the runtime list is unavailable', () => {
    const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
    const original = intl.supportedValuesOf;
    intl.supportedValuesOf = undefined; // simulate a runtime without Intl.supportedValuesOf
    try {
      render(<TimeZoneSelect defaultValue="UTC" />);
      // UTC heads the static fallback list.
      expect(screen.getByRole('option', { name: 'UTC' })).toBeInTheDocument();
    } finally {
      intl.supportedValuesOf = original;
    }
  });

  it('disables the control when `disabled`', () => {
    render(<TimeZoneSelect zones={['UTC']} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
