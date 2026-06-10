import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Kbd, Code } from './Kbd';

describe('Kbd & Code a11y', () => {
  it('have no violations', async () => {
    const { container } = render(
      <p>
        Press <Kbd>⌘ K</Kbd> then run <Code>pnpm dev</Code>.
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
