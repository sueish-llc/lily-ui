import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { RangeDual } from './RangeDual';

describe('RangeDual a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <RangeDual min={0} max={1000} step={10} defaultValue={[200, 800]} minLabel="下限価格" maxLabel="上限価格" />,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
