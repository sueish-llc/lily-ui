import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Badge } from './Badge';

describe('Badge a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Badge status="success">Active</Badge>);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
