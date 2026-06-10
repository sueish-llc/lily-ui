import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Stack } from './Stack';

describe('Stack a11y', () => {
  it('has no violations for a stack', async () => {
    const { container } = render(
      <Stack gap="3">
        <p>One</p>
        <p>Two</p>
      </Stack>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
