import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { DurationInput } from './DurationInput';

describe('DurationInput a11y', () => {
  it('has no violations with default props', async () => {
    const { container } = render(<DurationInput />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with a value and withSeconds', async () => {
    const dur = Temporal.Duration.from({ hours: 1, minutes: 30, seconds: 15 });
    const { container } = render(<DurationInput withSeconds value={dur} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const dur = Temporal.Duration.from({ hours: 2, minutes: 0 });
    const { container } = render(<DurationInput disabled value={dur} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
