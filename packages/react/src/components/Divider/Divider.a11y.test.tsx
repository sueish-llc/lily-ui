import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Divider } from './Divider';

describe('Divider a11y', () => {
  it('has no violations (plain + labeled)', async () => {
    const { container } = render(
      <div>
        <Divider />
        <Divider>または</Divider>
      </div>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
