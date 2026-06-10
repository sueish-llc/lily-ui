import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Meter } from './Meter';

describe('Meter a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Meter label="ストレージ" value={60} valueText="60%" status="warning" showValue />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
