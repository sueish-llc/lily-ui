import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <ScrollArea maxHeight={120}>
        <p>長い内容…</p>
      </ScrollArea>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
