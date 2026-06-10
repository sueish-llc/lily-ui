import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Fieldset } from './Fieldset';

describe('Fieldset a11y', () => {
  it('has no violations with controls', async () => {
    const { container } = render(
      <Fieldset legend="Contact details" description="Enter at least one.">
        <label>
          Email
          <input type="email" />
        </label>
        <label>
          Phone
          <input type="tel" />
        </label>
      </Fieldset>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when disabled', async () => {
    const { container } = render(
      <Fieldset legend="Billing address" disabled>
        <label>
          Street
          <input type="text" />
        </label>
      </Fieldset>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
