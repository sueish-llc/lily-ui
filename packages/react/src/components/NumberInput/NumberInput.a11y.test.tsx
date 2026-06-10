import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { NumberInput } from './NumberInput';
import { FormField } from '../FormField';

describe('NumberInput a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <FormField label="数量">
        <NumberInput min={0} max={10} defaultValue={1} />
      </FormField>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
