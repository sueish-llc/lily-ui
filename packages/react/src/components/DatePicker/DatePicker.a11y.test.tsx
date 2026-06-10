import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DatePicker } from './DatePicker';

const axeOptions = { rules: { 'color-contrast': { enabled: false } } } as const;

describe('DatePicker a11y', () => {
  it('has no detectable axe violations (closed)', async () => {
    const { container } = render(
      <DatePicker defaultValue={Temporal.PlainDate.from('2026-05-30')} />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no detectable axe violations (calendar open)', async () => {
    const { container } = render(
      <DatePicker defaultValue={Temporal.PlainDate.from('2026-05-30')} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
