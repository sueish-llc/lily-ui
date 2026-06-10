import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Stat } from './Stat';

describe('Stat a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Stat label="売上" value="¥1.2M" delta="+12%" trend="up" help="前月比" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
