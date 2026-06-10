import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Accordion } from './Accordion';

describe('Accordion a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Accordion
        defaultOpen={['a']}
        items={[
          { id: 'a', header: 'A', content: 'Body A' },
          { id: 'b', header: 'B', content: 'Body B' },
        ]}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
