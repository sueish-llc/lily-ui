import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Tree } from './Tree';

describe('Tree a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Tree
        aria-label="ファイル"
        defaultExpanded={['src']}
        nodes={[
          { id: 'src', label: 'src', children: [{ id: 'index', label: 'index.ts' }] },
          { id: 'readme', label: 'README.md' },
        ]}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
