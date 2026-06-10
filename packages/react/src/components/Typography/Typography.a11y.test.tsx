import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Text, Heading } from './Typography';

describe('Typography a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <article>
        <Heading level={1}>見出し</Heading>
        <Text variant="lead">導入文。</Text>
        <Text tone="muted">本文。</Text>
      </article>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
