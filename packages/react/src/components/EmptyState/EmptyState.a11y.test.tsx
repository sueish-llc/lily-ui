import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { EmptyState } from './EmptyState';

describe('EmptyState a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <EmptyState title="結果がありません" description="条件を変えて再検索してください。" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
