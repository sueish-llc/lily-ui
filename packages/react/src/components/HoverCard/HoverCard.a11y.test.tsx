import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { HoverCard } from './HoverCard';

describe('HoverCard a11y', () => {
  it('has no violations when closed', async () => {
    const { container } = render(
      <HoverCard content={<p>Details</p>}>
        <button>More</button>
      </HoverCard>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when open', async () => {
    const { container } = render(
      <HoverCard open content={<p>Details</p>}>
        <button>More</button>
      </HoverCard>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
