import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Navbar } from './Navbar';

describe('Navbar a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Navbar brand="Lily">
        <a href="#docs">Docs</a>
      </Navbar>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
