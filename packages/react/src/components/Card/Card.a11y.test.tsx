import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Card } from './Card';

describe('Card a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Card>
        <Card.Body>
          <Card.Title>Title</Card.Title>
          Body
        </Card.Body>
      </Card>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
