import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { InputGroup } from './InputGroup';
import { Input } from '../Input';
import { FormField } from '../FormField';

describe('InputGroup a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <FormField label="Username">
        <InputGroup>
          <InputGroup.Addon>@</InputGroup.Addon>
          <Input />
        </InputGroup>
      </FormField>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
