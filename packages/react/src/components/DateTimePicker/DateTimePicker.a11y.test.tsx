import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { DateTimePicker } from './DateTimePicker';

describe('DateTimePicker a11y', () => {
  it('has no detectable axe violations (closed)', async () => {
    const { container } = render(
      <DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')} />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no detectable axe violations (dialog open)', async () => {
    const { container } = render(
      <DateTimePicker defaultValue={Temporal.PlainDateTime.from('2026-05-30T09:30')} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Choose date and time' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
