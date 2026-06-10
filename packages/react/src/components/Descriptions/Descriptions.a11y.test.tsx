import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Descriptions } from './Descriptions';
import { DescriptionsItem } from './Descriptions';

describe('Descriptions a11y', () => {
  it('has no violations for default horizontal layout', async () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem term="Name">Lily UI</DescriptionsItem>
        <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
      </Descriptions>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for bordered two-column layout', async () => {
    const { container } = render(
      <Descriptions columns={2} bordered>
        <DescriptionsItem term="Name">Lily UI</DescriptionsItem>
        <DescriptionsItem term="Author">Lily Team</DescriptionsItem>
        <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
        <DescriptionsItem term="License">MIT</DescriptionsItem>
      </Descriptions>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for vertical layout', async () => {
    const { container } = render(
      <Descriptions columns={3} layout="vertical">
        <DescriptionsItem term="Name">Lily UI</DescriptionsItem>
        <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
        <DescriptionsItem term="License">MIT</DescriptionsItem>
      </Descriptions>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
