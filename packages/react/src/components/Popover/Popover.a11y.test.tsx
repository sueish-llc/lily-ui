import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Popover } from './Popover';

describe('Popover a11y', () => {
  it('has no violations (open)', async () => {
    const { container } = render(
      <Popover title="Info" content="Details" defaultOpen>
        <button>More</button>
      </Popover>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
