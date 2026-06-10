import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Container } from './Container';

describe('Container a11y', () => {
  it('has no violations for a container', async () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
