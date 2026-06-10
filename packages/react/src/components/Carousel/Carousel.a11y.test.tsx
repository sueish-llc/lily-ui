import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Carousel } from './Carousel';

describe('Carousel a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Carousel label="Gallery" slides={[<div key="1">1</div>, <div key="2">2</div>]} />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
