import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Transfer } from './Transfer';

describe('Transfer a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Transfer
        items={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
        defaultValue={['a']}
        titles={['候補', '選択済み']}
      />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
