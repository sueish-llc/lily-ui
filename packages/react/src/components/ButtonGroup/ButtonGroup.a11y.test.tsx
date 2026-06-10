import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';

describe('ButtonGroup a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <ButtonGroup label="Group">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
