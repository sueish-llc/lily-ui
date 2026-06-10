import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { TagInput } from './TagInput';
import { FormField } from '../FormField';

describe('TagInput a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <FormField label="宛先">
        <TagInput defaultValue={['ada@example.com', 'grace@example.com']} />
      </FormField>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
