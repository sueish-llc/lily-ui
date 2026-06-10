import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Now' }]} />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
