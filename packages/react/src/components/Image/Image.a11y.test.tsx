import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Image } from './Image';

describe('Image a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Image src="/p.jpg" alt="製品の写真" ratio={16 / 9} rounded />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
