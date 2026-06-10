import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Skeleton } from './Skeleton';

describe('Skeleton a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
