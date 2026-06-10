import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Progress } from './Progress';

describe('Progress a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Progress value={40} label="Loading" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
