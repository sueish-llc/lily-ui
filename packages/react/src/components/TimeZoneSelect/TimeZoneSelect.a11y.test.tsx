import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { TimeZoneSelect } from './TimeZoneSelect';

describe('TimeZoneSelect a11y', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(
      <TimeZoneSelect
        zones={['UTC', 'Asia/Tokyo', 'Europe/London']}
        defaultValue="UTC"
        aria-label="Time zone"
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
