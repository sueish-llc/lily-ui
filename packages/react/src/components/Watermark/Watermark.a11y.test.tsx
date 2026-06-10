import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Watermark } from './Watermark';

describe('Watermark a11y', () => {
  it('has no violations with text watermark', async () => {
    const { container } = render(
      <Watermark text="Confidential">
        <p>Protected content here.</p>
      </Watermark>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with custom opacity', async () => {
    const { container } = render(
      <Watermark text="Draft" opacity={0.08} rotate={-45}>
        <article>
          <h2>Article title</h2>
          <p>Body text.</p>
        </article>
      </Watermark>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations wrapping interactive content', async () => {
    const { container } = render(
      <Watermark text="Internal">
        <button type="button">Click me</button>
        <a href="#section">Learn more</a>
      </Watermark>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
