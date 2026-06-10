import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { RelativeTime } from './RelativeTime';

describe('RelativeTime a11y', () => {
  it('has no violations for a plain instant value', async () => {
    const inst = Temporal.Now.instant().subtract({ seconds: 3600 });
    const { container } = render(<RelativeTime value={inst} locale="en" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for a PlainDate value', async () => {
    const date = Temporal.PlainDate.from('2025-06-01');
    const { container } = render(<RelativeTime value={date} locale="en" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with an aria-label', async () => {
    const inst = Temporal.Now.instant().subtract({ seconds: 60 });
    const { container } = render(
      <RelativeTime value={inst} locale="en" aria-label="1 minute ago" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
