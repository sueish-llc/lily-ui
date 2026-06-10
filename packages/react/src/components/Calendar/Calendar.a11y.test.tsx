import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Calendar } from './Calendar';
import { toPlainDate } from '../../utils/datetime';

describe('Calendar a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Calendar defaultValue={toPlainDate('2026-05-15')} locale="en-US" aria-label="日付" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
