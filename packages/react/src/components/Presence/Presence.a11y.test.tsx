import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Presence } from './Presence';

describe('Presence a11y', () => {
  it('adds no semantics of its own (no violations)', async () => {
    const { container } = render(
      <Presence present>
        <section aria-label="panel">
          <p>Content</p>
        </section>
      </Presence>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
