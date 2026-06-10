import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Offcanvas } from './Offcanvas';

describe('Offcanvas a11y', () => {
  it('has no violations (open)', async () => {
    const { baseElement } = render(
      <Offcanvas open onClose={() => {}} title="Menu">
        Body
      </Offcanvas>,
    );
    expect(await axe(baseElement, axeOptions)).toHaveNoViolations();
  });
});
