import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { MonthPicker } from './MonthPicker';

describe('MonthPicker a11y', () => {
  it('has no detectable axe violations (closed)', async () => {
    const { container } = render(
      <MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no detectable axe violations (dialog open)', async () => {
    const { container } = render(
      <MonthPicker defaultValue={Temporal.PlainYearMonth.from('2026-05')} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Choose month/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
