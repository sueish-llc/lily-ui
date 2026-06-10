import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Dropdown } from './Dropdown';

describe('Dropdown a11y', () => {
  it('has no violations (open)', async () => {
    const { container } = render(
      <Dropdown trigger="Menu" defaultOpen>
        <Dropdown.Item>Edit</Dropdown.Item>
      </Dropdown>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
