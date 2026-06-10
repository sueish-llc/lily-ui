import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { CloseButton } from './CloseButton';

describe('CloseButton a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<CloseButton label="Close dialog" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
