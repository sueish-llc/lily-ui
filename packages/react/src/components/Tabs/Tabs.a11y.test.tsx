import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Tabs } from './Tabs';

describe('Tabs a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Tabs
        label="Demo"
        items={[
          { id: 't1', label: 'One', content: 'First' },
          { id: 't2', label: 'Two', content: 'Second' },
        ]}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
