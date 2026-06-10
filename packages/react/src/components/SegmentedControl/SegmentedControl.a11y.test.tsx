import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <SegmentedControl
        aria-label="表示モード"
        options={[
          { value: 'list', label: 'リスト' },
          { value: 'grid', label: 'グリッド' },
        ]}
        defaultValue="list"
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
