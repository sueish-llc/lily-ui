import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Combobox } from './Combobox';
import { FormField } from '../FormField';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
];

describe('Combobox a11y', () => {
  it('has no violations (open)', async () => {
    const { container } = render(
      <FormField label="果物">
        <Combobox options={fruits} />
      </FormField>,
    );
    await userEvent.click(container.querySelector('[role="combobox"]') as HTMLElement);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
