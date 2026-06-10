import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Rating } from './Rating';

describe('Rating a11y', () => {
  it('has no violations (interactive + readonly)', async () => {
    const { container } = render(
      <div>
        <Rating label="評価" defaultValue={3} />
        <Rating value={4} readOnly />
      </div>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
