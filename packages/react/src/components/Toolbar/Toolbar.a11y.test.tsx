import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Toolbar } from './Toolbar';
import { Button } from '../Button';

describe('Toolbar a11y', () => {
  it('has no violations (horizontal)', async () => {
    const { container } = render(
      <Toolbar aria-label="Text formatting">
        <Button variant="ghost" size="sm">
          Bold
        </Button>
        <Button variant="ghost" size="sm">
          Italic
        </Button>
        <Button variant="ghost" size="sm">
          Underline
        </Button>
      </Toolbar>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations (vertical)', async () => {
    const { container } = render(
      <Toolbar aria-label="Actions" orientation="vertical">
        <Button variant="ghost" size="sm">
          Cut
        </Button>
        <Button variant="ghost" size="sm">
          Copy
        </Button>
      </Toolbar>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
