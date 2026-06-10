import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Stepper } from './Stepper';

describe('Stepper a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Stepper active={1} steps={[{ label: 'カート' }, { label: '配送', description: '住所' }, { label: '確認' }]} />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
