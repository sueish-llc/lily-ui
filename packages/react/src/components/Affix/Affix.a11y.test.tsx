import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Affix } from './Affix';

describe('Affix a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Affix offset={16}>
        <nav aria-label="目次">content</nav>
      </Affix>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
