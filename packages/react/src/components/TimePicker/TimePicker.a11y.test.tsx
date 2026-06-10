import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { TimePicker } from './TimePicker';

describe('TimePicker a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<TimePicker hour12 defaultValue={Temporal.PlainTime.from('09:30')} hourLabel="時" minuteLabel="分" meridiemLabel="午前午後" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
