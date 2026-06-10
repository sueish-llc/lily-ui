import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Countdown } from './Countdown';

describe('Countdown a11y', () => {
  it('has no violations in dhms format', async () => {
    const target = Temporal.Now.plainDateTimeISO().add({ days: 1, hours: 2 });
    const { container } = render(<Countdown to={target} live={false} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations in hms format', async () => {
    const target = Temporal.Now.plainDateTimeISO().add({ hours: 3 });
    const { container } = render(<Countdown to={target} format="hms" live={false} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when expired', async () => {
    const past = Temporal.Now.plainDateTimeISO().subtract({ hours: 1 });
    const { container } = render(<Countdown to={past} live={false} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
