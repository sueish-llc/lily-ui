import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Splitter } from './Splitter';

describe('Splitter a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Splitter start={<div>左</div>} end={<div>右</div>} handleLabel="パネルのサイズ変更" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
