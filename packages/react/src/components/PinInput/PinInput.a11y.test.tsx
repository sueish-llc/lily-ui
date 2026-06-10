import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { PinInput } from './PinInput';

describe('PinInput a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<PinInput length={4} label="認証コード" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
