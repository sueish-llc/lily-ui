import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { FormField } from './FormField';
import { Input } from '../Input';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';
import { Switch } from '../Switch';
import { Range } from '../Range';

describe('FormField a11y', () => {
  it('text fields', async () => {
    const { container } = render(
      <form>
        <FormField label="Name" help="Full name">
          <Input />
        </FormField>
        <FormField label="Bio">
          <Textarea />
        </FormField>
        <FormField label="Country">
          <Select>
            <option>Japan</option>
          </Select>
        </FormField>
      </form>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('choice controls', async () => {
    const { container } = render(
      <form>
        <Checkbox label="Accept" />
        <Switch label="Notifications" />
        <fieldset>
          <legend>Plan</legend>
          <Radio name="plan" value="a" label="A" />
          <Radio name="plan" value="b" label="B" />
        </fieldset>
        <FormField label="Volume">
          <Range />
        </FormField>
      </form>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
