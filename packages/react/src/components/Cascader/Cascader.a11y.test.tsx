import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Cascader } from './Cascader';

describe('Cascader a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Cascader
        aria-label="地域"
        defaultValue={['jp']}
        options={[
          { value: 'jp', label: '日本', children: [{ value: 'kanto', label: '関東' }] },
          { value: 'us', label: 'USA' },
        ]}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
